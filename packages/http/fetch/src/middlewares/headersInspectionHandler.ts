/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { RequestOption } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { Middleware } from "./middleware";
import { HeadersInspectionOptions, HeadersInspectionOptionsKey } from "./options/headersInspectionOptions";

/**
 * @class
 * @implements Middleware
 * Inspects the headers of the request and response
 */
export class HeadersInspectionHandler implements Middleware {
	/**
	 * @constructor
	 * @public
	 * Creates new instance of HeadersInspectionHandler
	 * @param {HeadersInspectionOptions} _options The options for inspecting the headers
	 */
	public constructor(private readonly _options: HeadersInspectionOptions = new HeadersInspectionOptions()) {}
	/**
	 * @private
	 * The next middleware in the middleware chain
	 */
	next: Middleware | undefined;
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption> | undefined): Promise<Response> {
		let currentOptions = this._options;
		if (requestOptions?.[HeadersInspectionOptionsKey]) {
			currentOptions = requestOptions[HeadersInspectionOptionsKey] as HeadersInspectionOptions;
		}
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("retryHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.headersInspection.enable", true);
					return this.executeInternal(url, requestInit, requestOptions, currentOptions);
				} finally {
					span.end();
				}
			});
		}
		return this.executeInternal(url, requestInit, requestOptions, currentOptions);
	}
	private async executeInternal(url: string, requestInit: RequestInit, requestOptions: Record<string, RequestOption> | undefined, currentOptions: HeadersInspectionOptions): Promise<Response> {
		if (!this.next) {
			throw new Error("next middleware is undefined.");
		}
		if (currentOptions.inspectRequestHeaders && requestInit.headers) {
			for (const [key, value] of requestInit.headers as [string, string][]) {
				currentOptions.getRequestHeaders()[key] = [value];
			}
		}

		const response = await this.next.execute(url, requestInit, requestOptions);
		if (currentOptions.inspectResponseHeaders && response.headers) {
			for (const [key, value] of response.headers.entries()) {
				currentOptions.getResponseHeaders()[key] = [value];
			}
		}

		return response;
	}
}
