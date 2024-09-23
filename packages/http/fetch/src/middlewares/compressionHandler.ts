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
import type { FetchHeadersInit, FetchRequestInit } from "../utils/fetchDefinitions";
import { deleteRequestHeader, getRequestHeader, setRequestHeader } from "../utils/headersUtil";

/**
 * Compress the url content.
 */
export class CompressionHandler implements Middleware {
	next: Middleware | undefined;

	/**
	 * @private
	 * @static
	 * A member holding the name of content range header
	 */
	private static CONTENT_RANGE_HEADER = "Content-Range";

	/**
	 * @private
	 * @static
	 * A member holding the name of content encoding header
	 */
	private static CONTENT_ENCODING_HEADER = "Content-Encoding";

	/**
	 * @public
	 * @constructor
	 * Creates a new instance of the CompressionHandler class
	 * @param {CompressionHandlerOptions} handlerOptions The options for the compression handler.
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
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption> | undefined): Promise<Response> {
		let currentOptions = this.handlerOptions;
		if (requestOptions && requestOptions[CompressionHandlerOptionsKey]) {
			currentOptions = requestOptions[CompressionHandlerOptionsKey] as CompressionHandlerOptions;
		}
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("compressionHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.compression.enable", currentOptions.ShouldCompress);
					return this.executeInternal(currentOptions, url, requestInit as FetchRequestInit, requestOptions, span);
				} finally {
					span.end();
				}
			});
		}
		return this.executeInternal(currentOptions, url, requestInit as FetchRequestInit, requestOptions);
	}

	private async executeInternal(options: CompressionHandlerOptions, url: string, requestInit: FetchRequestInit, requestOptions?: Record<string, RequestOption> | undefined, span?: Span): Promise<Response> {
		if (!options.ShouldCompress || this.contentRangeBytesIsPresent(requestInit.headers) || this.contentEncodingIsPresent(requestInit.headers) || requestInit.body === null || requestInit.body === undefined) {
			return this.next?.execute(url, requestInit as RequestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
		}

		span?.setAttribute("http.request.body.compressed", true);

		const unCompressedBody = requestInit.body;
		const unCompressedBodySize = this.getRequestBodySize(unCompressedBody);

		// compress the request body
		const compressedBody = await this.compressRequestBody(unCompressedBody);

		// add Content-Encoding to request header
		setRequestHeader(requestInit, CompressionHandler.CONTENT_ENCODING_HEADER, "gzip");
		requestInit.body = compressedBody.compressedBody;

		span?.setAttribute("http.request.body.size", compressedBody.size);

		// execute the next middleware and check if the response code is 415
		const response = await this.next?.execute(url, requestInit as RequestInit, requestOptions);
		if (response?.status === 415) {
			// remove the Content-Encoding header
			deleteRequestHeader(requestInit, CompressionHandler.CONTENT_ENCODING_HEADER);
			requestInit.body = unCompressedBody;
			span?.setAttribute("http.request.body.compressed", false);
			span?.setAttribute("http.request.body.size", unCompressedBodySize);

			return this.next?.execute(url, requestInit as RequestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
		}
		return response != null ? Promise.resolve(response) : Promise.reject(new Error("Response is undefined"));
	}

	private contentRangeBytesIsPresent(header: FetchHeadersInit | undefined): boolean {
		if (!header) {
			return false;
		}
		const contentRange = getRequestHeader(header, CompressionHandler.CONTENT_RANGE_HEADER);
		return contentRange !== undefined && contentRange.toLowerCase().includes("bytes");
	}

	private contentEncodingIsPresent(header: FetchHeadersInit | undefined): boolean {
		if (!header) {
			return false;
		}
		return getRequestHeader(header, CompressionHandler.CONTENT_ENCODING_HEADER) !== undefined;
	}

	private getRequestBodySize(body: any): number {
		if (!body) {
			return 0;
		}
		if (typeof body === "string") {
			return body.length;
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

	private async readBodyAsBytes(body: BodyInit | null | undefined): Promise<{ stream: ReadableStream<Uint8Array>; size: number }> {
		if (!body) {
			return { stream: new ReadableStream<Uint8Array>(), size: 0 };
		}

		const uint8ArrayToStream = (uint8Array: Uint8Array): ReadableStream<Uint8Array> => {
			return new ReadableStream({
				start(controller) {
					controller.enqueue(uint8Array);
					controller.close();
				},
			});
		};

		if (typeof body === "string") {
			return { stream: uint8ArrayToStream(new TextEncoder().encode(body)), size: body.length };
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

	private async compressRequestBody(body: any): Promise<{
		compressedBody: ArrayBuffer | Buffer;
		size: number;
	}> {
		if (!inNodeEnv()) {
			// in browser
			const compressionData = await this.readBodyAsBytes(body);
			const compressedBody = await this.compressUsingCompressionStream(compressionData.stream);
			return {
				compressedBody: compressedBody.body,
				size: compressedBody.size,
			};
		} else {
			// In Node.js
			const compressedBody = await this.compressUsingZlib(body);
			return {
				compressedBody,
				size: compressedBody.length,
			};
		}
	}

	private compressUsingZlib(body: any): Promise<Buffer> {
		return new Promise(async (resolve, reject) => {
			// @ts-ignore
			const zlib = await import("zlib");
			zlib.gzip(body, (err, compressed) => {
				if (err) {
					reject(err);
				} else {
					resolve(compressed);
				}
			});
		});
	}

	private compressUsingCompressionStream(uint8ArrayStream: ReadableStream<Uint8Array>): Promise<{ body: ArrayBuffer; size: number }> {
		return new Promise(async (resolve, reject) => {
			const compressionStream = new CompressionStream("gzip");

			const compressedStream = uint8ArrayStream.pipeThrough(compressionStream);

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

			resolve({
				body: compressedArray.buffer,
				size: compressedArray.length,
			});
		});
	}
}
