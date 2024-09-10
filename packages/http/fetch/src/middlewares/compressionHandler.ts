/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";
import { Span, trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { Middleware } from "./middleware";
import { CompressionHandlerOptions, CompressionHandlerOptionsKey } from "./options/compressionHandlerOptions";

/**
 * Compress the url content.
 */
export class CompressionHandler implements Middleware {
	next: Middleware | undefined;

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
					return this.executeInternal(currentOptions, url, requestInit, requestOptions, span);
				} finally {
					span.end();
				}
			});
		}
		return this.executeInternal(currentOptions, url, requestInit, requestOptions);
	}

	private async executeInternal(options: CompressionHandlerOptions, url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption> | undefined, span?: Span): Promise<Response> {
		if (!options.ShouldCompress || this.contentRangeBytesIsPresent(requestInit.headers) || this.contentEncodingIsPresent(requestInit.headers) || requestInit.body === null || requestInit.body === undefined) {
			return this.next?.execute(url, requestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
		}

		span?.setAttribute("http.request_body_compressed", true);

		const unCompressedBody = await this.readBodyAsBytes(requestInit.body);
		const unCompressedBodySize = unCompressedBody.length;

		// compress the request body
		const compressedBody = await this.compressReqBody(unCompressedBody);

		// add Content-Encoding to request header
		requestInit.headers = new Headers(requestInit.headers);
		requestInit.headers.set("Content-Encoding", "gzip");
		requestInit.body = compressedBody.body;

		span?.setAttribute("http.request_content_length", compressedBody.size);

		// execute the next middleware and check if the response code is 415
		try {
			const response = await this.next?.execute(url, requestInit, requestOptions);
			if (response?.status === 415) {
				// remove the Content-Encoding header
				requestInit.headers.delete("Content-Encoding");
				requestInit.body = unCompressedBody.buffer;
				span?.setAttribute("http.request_body_compressed", false);
				span?.setAttribute("http.request_content_length", unCompressedBodySize);

				return this.next?.execute(url, requestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
			}
		} catch (error) {
			return this.next?.execute(url, requestInit, requestOptions) ?? Promise.reject(new Error("Response is undefined"));
		}
	}

	private contentRangeBytesIsPresent(header: HeadersInit | undefined): boolean {
		if (!header) {
			return false;
		}
		if (header instanceof Headers) {
			const contentRange = header.get("Content-Range");
			if (contentRange) {
				return contentRange.toLowerCase().includes("bytes");
			}
		} else if (typeof header === "object") {
			const contentRange = (header as Record<string, string>)["Content-Range"];
			if (contentRange) {
				return contentRange.toLowerCase().includes("bytes");
			}
		}
		return false;
	}

	private contentEncodingIsPresent(header: HeadersInit | undefined): boolean {
		if (!header) {
			return false;
		}
		if (header instanceof Headers) {
			return header.has("Content-Encoding");
		} else if (typeof header === "object") {
			return "Content-Encoding" in header;
		}
		return false;
	}

	private async readBodyAsBytes(body: BodyInit | null | undefined): Promise<Uint8Array> {
		if (!body) {
			return new Uint8Array();
		}
		if (typeof body === "string") {
			return new TextEncoder().encode(body);
		}
		if (body instanceof Blob) {
			return new Uint8Array(await body.arrayBuffer());
		}
		if (body instanceof ArrayBuffer) {
			return new Uint8Array(body);
		}
		if (ArrayBuffer.isView(body)) {
			return new Uint8Array(body.buffer);
		}
		throw new Error("Unsupported body type");
	}


  private  compressReqBody(reqBody: Uint8Array): Promise<{ body: ReadableStream<Uint8Array>, size: number }> {
      return new Promise((resolve, reject) => {
          const buffer = new ArrayBuffer(reqBody.length);
          const gzipWriter = new CompressionStream('gzip');
          const writer = gzipWriter.writable.getWriter();

          writer.write(reqBody).then(() => {
              writer.close().then(() => {
                  const compressedStream = gzipWriter.readable;
                  const reader = compressedStream.getReader();
                  let size = 0;

                  reader.read().then(function process({ done, value }) {
                      if (done) {
                          resolve({ body: new Response(buffer).body!, size });
                          return;
                      }
                      size += value.length;
                      reader.read().then(process);
                  }).catch(reject);
              }).catch(reject);
          }).catch(reject);
      });
  }
}
