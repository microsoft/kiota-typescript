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
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("bodyInspectionHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.bodyInspection.enable", true);
					return this.executeInternal(url, requestInit, requestOptions, currentOptions);
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
			currentOptions.setRequestBody(new TextEncoder().encode(rawBody).buffer as ArrayBuffer);
		} else if (rawBody instanceof ArrayBuffer) {
			currentOptions.setRequestBody(rawBody.slice(0));
		} else if (ArrayBuffer.isView(rawBody)) {
			currentOptions.setRequestBody(rawBody.buffer.slice(rawBody.byteOffset, rawBody.byteOffset + rawBody.byteLength));
		} else if (typeof Blob !== "undefined" && rawBody instanceof Blob) {
			const buffer = await rawBody.arrayBuffer();
			currentOptions.setRequestBody(buffer.slice(0));
			requestInit.body = new Blob([buffer], { type: rawBody.type });
		} else if (typeof ReadableStream !== "undefined" && rawBody instanceof ReadableStream) {
			const [stream1, stream2] = rawBody.tee();
			requestInit.body = stream1;
			const reader = stream2.getReader();
			const chunks: Uint8Array[] = [];
			let totalLength = 0;
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (value) {
					chunks.push(value);
					totalLength += value.length;
				}
			}
			const concatenated = new Uint8Array(totalLength);
			let offset = 0;
			for (const chunk of chunks) {
				concatenated.set(chunk, offset);
				offset += chunk.length;
			}
			currentOptions.setRequestBody(concatenated.buffer);
		} else if (typeof URLSearchParams !== "undefined" && rawBody instanceof URLSearchParams) {
			currentOptions.setRequestBody(new TextEncoder().encode(rawBody.toString()).buffer as ArrayBuffer);
		}
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
