/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { Middleware } from "./middleware";
import { BodyInspectionOptions, BodyInspectionOptionsKey } from "./options/bodyInspectionOptions";

/**
 * Middleware
 * Inspects the body of the request and response
 */
export class BodyInspectionHandler implements Middleware {
	/**
	 * Creates new instance of BodyInspectionHandler
	 * @param _options The options for inspecting the bodies
	 */
	public constructor(private readonly _options: BodyInspectionOptions = new BodyInspectionOptions()) {}

	/**
	 * The next middleware in the middleware chain
	 */
	next: Middleware | undefined;

	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		let currentOptions = this._options;
		if (requestOptions?.[BodyInspectionOptionsKey]) {
			currentOptions = requestOptions[BodyInspectionOptionsKey] as BodyInspectionOptions;
		}
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("bodyInspectionHandler - execute", async (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.bodyInspection.enable", currentOptions.inspectRequestBody || currentOptions.inspectResponseBody);
					return await this.executeInternal(url, requestInit, requestOptions, currentOptions);
				} finally {
					span.end();
				}
			});
		}
		return this.executeInternal(url, requestInit, requestOptions, currentOptions);
	}

	private async executeInternal(url: string, requestInit: RequestInit, requestOptions: Record<string, RequestOption> | undefined, currentOptions: BodyInspectionOptions): Promise<Response> {
		if (!this.next) {
			throw new Error("next middleware is undefined.");
		}

		currentOptions.setRequestBody(undefined);
		currentOptions.setResponseBody(undefined);

		if (currentOptions.inspectRequestBody && requestInit.body !== undefined && requestInit.body !== null) {
			await this.inspectRequestBody(requestInit, currentOptions);
		}

		const response = await this.next.execute(url, requestInit, requestOptions);

		if (currentOptions.inspectResponseBody && response) {
			await this.inspectResponseBody(response, currentOptions);
		}

		return response;
	}

	private async inspectRequestBody(requestInit: RequestInit, currentOptions: BodyInspectionOptions): Promise<void> {
		const rawBody = requestInit.body;
		if (typeof rawBody === "string") {
			currentOptions.setRequestBody(new TextEncoder().encode(rawBody).buffer);
		} else if (rawBody instanceof ArrayBuffer) {
			currentOptions.setRequestBody(rawBody.slice(0));
		} else if (ArrayBuffer.isView(rawBody)) {
			currentOptions.setRequestBody(rawBody.buffer.slice(rawBody.byteOffset, rawBody.byteOffset + rawBody.byteLength));
		} else if (typeof Blob !== "undefined" && rawBody instanceof Blob) {
			const buffer = await rawBody.arrayBuffer();
			currentOptions.setRequestBody(buffer.slice(0));
			requestInit.body = new Blob([buffer], { type: rawBody.type });
		} else if (typeof ReadableStream !== "undefined" && rawBody instanceof ReadableStream) {
			const stream = rawBody as ReadableStream<Uint8Array>;
			const [stream1, stream2] = stream.tee();
			requestInit.body = stream1;
			const reader = stream2.getReader();
			const chunks: Uint8Array[] = [];
			let totalLength = 0;
			while (true) {
				const result = await reader.read();
				if (result.done) {
					break;
				}
				const chunk = result.value;
				if (chunk) {
					chunks.push(chunk);
					totalLength += chunk.length;
				}
			}
			const concatenated = this.concatenateChunks(chunks, totalLength);
			currentOptions.setRequestBody(concatenated.buffer);
		} else if (typeof URLSearchParams !== "undefined" && rawBody instanceof URLSearchParams) {
			currentOptions.setRequestBody(new TextEncoder().encode(rawBody.toString()).buffer);
		} else if (this.isAsyncIterable(rawBody)) {
			const chunks: Uint8Array[] = [];
			let totalLength = 0;
			for await (const chunk of rawBody) {
				const bytes = this.toBytes(chunk);
				chunks.push(bytes);
				totalLength += bytes.byteLength;
			}
			const concatenated = this.concatenateChunks(chunks, totalLength);
			currentOptions.setRequestBody(concatenated.buffer);
			requestInit.body = concatenated;
		}
	}

	private isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
		return typeof value === "object" && value !== null && Symbol.asyncIterator in value && typeof (value as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function";
	}

	private toBytes(value: unknown): Uint8Array {
		if (typeof value === "string") {
			return new TextEncoder().encode(value);
		}
		if (value instanceof ArrayBuffer) {
			return new Uint8Array(value);
		}
		if (ArrayBuffer.isView(value)) {
			return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
		}
		throw new TypeError("Request body streams must emit strings or byte arrays.");
	}

	private concatenateChunks(chunks: readonly Uint8Array<ArrayBufferLike>[], totalLength: number): Uint8Array<ArrayBuffer> {
		const concatenated = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of chunks) {
			concatenated.set(chunk, offset);
			offset += chunk.byteLength;
		}
		return concatenated;
	}

	private async inspectResponseBody(response: Response, currentOptions: BodyInspectionOptions): Promise<void> {
		if (typeof response.clone === "function") {
			try {
				const cloned = response.clone();
				const buffer = await cloned.arrayBuffer();
				if (buffer.byteLength > 0) {
					currentOptions.setResponseBody(buffer);
				} else {
					currentOptions.setResponseBody(undefined);
				}
			} catch {
				// Body might already be disturbed or unavailable
			}
		}
	}
}
