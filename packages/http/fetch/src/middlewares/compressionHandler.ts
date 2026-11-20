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
import { CompressionHandlerOptions, CompressionHandlerOptionsKey } from "./options/compressionHandlerOptions";
import type { FetchRequestInit } from "../utils/fetchDefinitions";
import { deleteRequestHeader, getRequestHeader, setRequestHeader } from "../utils/headersUtil";

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
	 * A member holding the name of content type header
	 */
	private static readonly CONTENT_TYPE_HEADER = "Content-Type";

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
		if (!options.ShouldCompress || this.contentRangeBytesIsPresent(requestInit) || this.contentEncodingIsPresent(requestInit) || requestInit.body === null || requestInit.body === undefined) {
			return this.next?.execute(url, requestInit as RequestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
		}

		span?.setAttribute("http.request.body.compressed", true);

		const unCompressedBody = requestInit.body;
		const unCompressedBodySize = this.getRequestBodySize(unCompressedBody);

		// compress the request body
		const compressedBody = await this.compressRequestBody(unCompressedBody);
		let addedUrlEncodedContentType = false;
		if (unCompressedBody instanceof URLSearchParams && getRequestHeader(requestInit, CompressionHandler.CONTENT_TYPE_HEADER) === undefined) {
			setRequestHeader(requestInit, CompressionHandler.CONTENT_TYPE_HEADER, "application/x-www-form-urlencoded;charset=UTF-8");
			addedUrlEncodedContentType = true;
		}

		// add Content-Encoding to request header
		setRequestHeader(requestInit, CompressionHandler.CONTENT_ENCODING_HEADER, "gzip");
		requestInit.body = compressedBody.compressedBody;

		span?.setAttribute("http.request.body.size", compressedBody.size);

		// execute the next middleware and check if the response code is 415
		let response = await this.next?.execute(url, requestInit as RequestInit, requestOptions);
		if (!response) {
			throw new Error("Response is undefined");
		}
		if (response.status === 415) {
			// remove the Content-Encoding header
			deleteRequestHeader(requestInit, CompressionHandler.CONTENT_ENCODING_HEADER);
			if (addedUrlEncodedContentType) {
				deleteRequestHeader(requestInit, CompressionHandler.CONTENT_TYPE_HEADER);
			}
			requestInit.body = unCompressedBody;
			span?.setAttribute("http.request.body.compressed", false);
			span?.setAttribute("http.request.body.size", unCompressedBodySize);

			response = await this.next?.execute(url, requestInit as RequestInit, requestOptions);
		}
		return response !== undefined && response !== null ? Promise.resolve(response) : Promise.reject(new Error("Response is undefined"));
	}

	private contentRangeBytesIsPresent(requestInit: FetchRequestInit): boolean {
		const contentRange = getRequestHeader(requestInit, CompressionHandler.CONTENT_RANGE_HEADER);
		return contentRange?.toLowerCase().includes("bytes") ?? false;
	}

	private contentEncodingIsPresent(requestInit: FetchRequestInit): boolean {
		const contentEncoding = getRequestHeader(requestInit, CompressionHandler.CONTENT_ENCODING_HEADER);
		return contentEncoding !== undefined && contentEncoding.trim().length > 0;
	}

	private getRequestBodySize(body: unknown): number {
		if (body === null || body === undefined) {
			return 0;
		}
		if (typeof body === "string") {
			return new TextEncoder().encode(body).byteLength;
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
		const uint8ArrayToStream = (uint8Array: Uint8Array): ReadableStream<Uint8Array> => {
			return new ReadableStream({
				start: (controller) => {
					if (uint8Array.byteLength > 0) {
						controller.enqueue(uint8Array);
					}
					controller.close();
				},
			});
		};

		if (body === null || body === undefined) {
			return { stream: uint8ArrayToStream(new Uint8Array(0)), size: 0 };
		}
		if (typeof body === "string") {
			const bytes = new TextEncoder().encode(body);
			return { stream: uint8ArrayToStream(bytes), size: bytes.byteLength };
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
