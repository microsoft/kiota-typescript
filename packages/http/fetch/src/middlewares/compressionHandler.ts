/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type RequestOption, inNodeEnv } from "@microsoft/kiota-abstractions";
import { Span, trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { Middleware } from "./middleware";
import { BodyInspectionOptions, BodyInspectionOptionsKey } from "./options/bodyInspectionOptions";
import { CompressionHandlerOptions, CompressionHandlerOptionsKey } from "./options/compressionHandlerOptions";
import type { FetchRequestInit } from "../utils/fetchDefinitions";
import { deleteRequestHeader, setRequestHeader } from "../utils/headersUtil";

/**
 * Compress the url content.
 */
export class CompressionHandler implements Middleware {
	next: Middleware | undefined;

	/**
	 * A member holding the name of content range header
	 */
	private static readonly CONTENT_RANGE_HEADER = "Content-Range";

	/**
	 * A member holding the name of content encoding header
	 */
	private static readonly CONTENT_ENCODING_HEADER = "Content-Encoding";

	/**
	 * Creates a new instance of the CompressionHandler class
	 * @param handlerOptions The options for the compression handler.
	 * @returns An instance of the CompressionHandler class
	 */
	public constructor(private readonly handlerOptions: CompressionHandlerOptions = new CompressionHandlerOptions()) {
		if (!handlerOptions) {
			throw new Error("handlerOptions cannot be undefined");
		}
	}

	/**
	 * @inheritdoc
	 */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		let currentOptions = this.handlerOptions;
		if (requestOptions?.[CompressionHandlerOptionsKey]) {
			currentOptions = requestOptions[CompressionHandlerOptionsKey] as CompressionHandlerOptions;
		}
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("compressionHandler - execute", async (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.compression.enable", Boolean(currentOptions.ShouldCompress));
					return await this.executeInternal(currentOptions, url, requestInit as FetchRequestInit, requestOptions, span);
				} catch (error) {
					span.recordException(error as Error);
					throw error;
				} finally {
					span.end();
				}
			});
		}
		return this.executeInternal(currentOptions, url, requestInit as FetchRequestInit, requestOptions);
	}

	private async executeInternal(options: CompressionHandlerOptions, url: string, requestInit: FetchRequestInit, requestOptions?: Record<string, RequestOption>, span?: Span): Promise<Response> {
		if (!options.ShouldCompress || requestInit.body === null || requestInit.body === undefined) {
			return this.next?.execute(url, requestInit as RequestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
		}
		const headers = new Headers(requestInit.headers);
		if (headers.get(CompressionHandler.CONTENT_RANGE_HEADER)?.toLowerCase().includes("bytes") || headers.has(CompressionHandler.CONTENT_ENCODING_HEADER)) {
			return this.next?.execute(url, requestInit as RequestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
		}

		span?.setAttribute("http.request.body.compressed", true);

		let unCompressedBody = requestInit.body;
		if ((requestOptions?.[BodyInspectionOptionsKey] as BodyInspectionOptions | undefined)?.inspectRequestBody && this.isStream(unCompressedBody)) {
			// Inspection already opts in to buffering single-use bodies; buffer before encoding so both sends can reuse the bytes.
			unCompressedBody = new Uint8Array(await new Response(unCompressedBody as BodyInit).arrayBuffer());
		}
		const unCompressedBodySize = this.getRequestBodySize(unCompressedBody);

		const compressedBody = await this.compressRequestBody(unCompressedBody);
		if (unCompressedBody instanceof URLSearchParams && !headers.has("Content-Type")) {
			headers.set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		}

		const contentLength = headers.get("Content-Length");
		headers.delete("Content-Length");
		requestInit.headers = Object.fromEntries(headers.entries());
		setRequestHeader(requestInit, CompressionHandler.CONTENT_ENCODING_HEADER, "gzip");
		requestInit.body = compressedBody.compressedBody;

		span?.setAttribute("http.request.body.size", compressedBody.size);

		let response = await this.next?.execute(url, requestInit as RequestInit, requestOptions);
		if (!response) {
			throw new Error("Response is undefined");
		}
		// A 415 from a later hop must not replay the original request, which may have already been processed.
		if (response.status === 415 && requestInit.body === compressedBody.compressedBody && this.isResponseFromRequestUrl(url, response)) {
			deleteRequestHeader(requestInit, CompressionHandler.CONTENT_ENCODING_HEADER);
			if (contentLength !== null) {
				setRequestHeader(requestInit, "content-length", contentLength);
			}
			requestInit.body = unCompressedBody;
			span?.setAttribute("http.request.body.compressed", false);
			span?.setAttribute("http.request.body.size", unCompressedBodySize);

			response = await this.next?.execute(url, requestInit as RequestInit, requestOptions);
		}
		return response !== undefined && response !== null ? Promise.resolve(response) : Promise.reject(new Error("Response is undefined"));
	}

	private isStream(body: unknown): boolean {
		return (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) || (inNodeEnv() && typeof body === "object" && body !== null && Symbol.asyncIterator in body);
	}

	private isResponseFromRequestUrl(url: string, response: Response): boolean {
		if (response.redirected) {
			return false;
		}
		if (!response.url) {
			return true;
		}
		try {
			const requestUrl = new URL(url, globalThis.location?.href);
			requestUrl.hash = "";
			return response.url === requestUrl.href;
		} catch {
			return false;
		}
	}

	private getRequestBodySize(body: unknown): number {
		if (!body) {
			return 0;
		}
		if (typeof body === "string") {
			return body.length;
		}
		if (body instanceof URLSearchParams) {
			return new TextEncoder().encode(body.toString()).byteLength;
		}
		if (body instanceof Blob) {
			return body.size;
		}
		if (body instanceof ArrayBuffer) {
			return body.byteLength;
		}
		if (ArrayBuffer.isView(body)) {
			return body.byteLength;
		}
		if (inNodeEnv() && Buffer.isBuffer(body)) {
			return body.byteLength;
		}
		throw new Error("Unsupported body type");
	}

	private readBodyAsBytes(body: unknown): { stream: ReadableStream<Uint8Array>; size: number } {
		if (!body) {
			return { stream: new ReadableStream<Uint8Array>(), size: 0 };
		}

		const uint8ArrayToStream = (uint8Array: Uint8Array): ReadableStream<Uint8Array> => {
			return new ReadableStream({
				start: (controller) => {
					controller.enqueue(uint8Array);
					controller.close();
				},
			});
		};

		if (typeof body === "string") {
			return { stream: uint8ArrayToStream(new TextEncoder().encode(body)), size: body.length };
		}
		if (body instanceof URLSearchParams) {
			const bytes = new TextEncoder().encode(body.toString());
			return { stream: uint8ArrayToStream(bytes), size: bytes.byteLength };
		}
		if (body instanceof Blob) {
			return { stream: body.stream(), size: body.size };
		}
		if (body instanceof ArrayBuffer) {
			return { stream: uint8ArrayToStream(new Uint8Array(body)), size: body.byteLength };
		}
		if (ArrayBuffer.isView(body)) {
			return { stream: uint8ArrayToStream(new Uint8Array(body.buffer, body.byteOffset, body.byteLength)), size: body.byteLength };
		}
		throw new Error("Unsupported body type");
	}

	private async compressRequestBody(body: unknown): Promise<{
		compressedBody: ArrayBuffer | Buffer;
		size: number;
	}> {
		const compressionData = this.readBodyAsBytes(body);
		const compressedBody = await this.compressUsingCompressionStream(compressionData.stream);
		return {
			compressedBody: compressedBody.body,
			size: compressedBody.size,
		};
	}

	private async compressUsingCompressionStream(uint8ArrayStream: ReadableStream<Uint8Array>): Promise<{ body: ArrayBuffer; size: number }> {
		const compressionStream = new CompressionStream("gzip");

		const compressedStream = uint8ArrayStream.pipeThrough<Uint8Array>(compressionStream as ReadableWritablePair<Uint8Array, Uint8Array>);

		const reader = compressedStream.getReader();
		const compressedChunks: Uint8Array[] = [];
		let totalLength = 0;

		let result = await reader.read();
		while (!result.done) {
			const chunk = result.value;
			compressedChunks.push(chunk);
			totalLength += chunk.length;
			result = await reader.read();
		}

		const compressedArray = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of compressedChunks) {
			compressedArray.set(chunk, offset);
			offset += chunk.length;
		}

		return {
			body: compressedArray.buffer,
			size: compressedArray.length,
		};
	}
}
