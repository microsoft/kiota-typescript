/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module UserAgentHandler
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { FetchRequestInit } from "../utils/fetchDefinitions";
import { appendRequestHeader, getRequestHeader } from "../utils/headersUtil";
import type { Middleware } from "./middleware";
import { UserAgentHandlerOptions, UserAgentHandlerOptionsKey } from "./options/userAgentHandlerOptions";

const USER_AGENT_HEADER_KEY = "User-Agent";
export class UserAgentHandler implements Middleware {
	/**
	 * To create an instance of UserAgentHandler
	 * @param _options - The options for the middleware
	 */
	public constructor(private readonly _options: UserAgentHandlerOptions = new UserAgentHandlerOptions()) {}
	/** @inheritdoc */
	next: Middleware | undefined;
	/** @inheritdoc */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("userAgentHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.useragent.enable", true);
					return this.addValue(url, requestInit, requestOptions);
				} finally {
					span.end();
				}
			});
		} else {
			return this.addValue(url, requestInit, requestOptions);
		}
	}
	private async addValue(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		let currentOptions = this._options;
		if (requestOptions?.[UserAgentHandlerOptionsKey]) {
			currentOptions = requestOptions[UserAgentHandlerOptionsKey] as UserAgentHandlerOptions;
		}
		if (currentOptions.enable) {
			const additionalValue = `${currentOptions.productName}/${currentOptions.productVersion}`;
			const currentValue = getRequestHeader(requestInit as FetchRequestInit, USER_AGENT_HEADER_KEY);
			if (!currentValue?.includes(additionalValue)) {
				appendRequestHeader(requestInit as FetchRequestInit, USER_AGENT_HEADER_KEY, additionalValue, " ");
			}
		}
		const response = await this.next?.execute(url, requestInit, requestOptions);
		if (!response) throw new Error("No response returned by the next middleware");
		return response;
	}
}
