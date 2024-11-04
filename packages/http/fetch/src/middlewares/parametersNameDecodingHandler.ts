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
import { ParametersNameDecodingHandlerOptions, ParametersNameDecodingHandlerOptionsKey } from "./options/parametersNameDecodingOptions";

/**
 * @module ParametersNameDecodingHandler
 */

export class ParametersNameDecodingHandler implements Middleware {
	/**
	 *
	 * To create an instance of ParametersNameDecodingHandler
	 * @param [options] - The parameters name decoding handler options value
	 */
	public constructor(private readonly options: ParametersNameDecodingHandlerOptions = new ParametersNameDecodingHandlerOptions()) {
		if (!options) {
			throw new Error("The options parameter is required.");
		}
	}
	/** @inheritdoc */
	next: Middleware | undefined;
	/**
	 * To execute the current middleware
	 * @param url - The url to be fetched
	 * @param requestInit - The request init object
	 * @param requestOptions - The request options
	 * @returns A Promise that resolves to nothing
	 */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		let currentOptions = this.options;
		if (requestOptions?.[ParametersNameDecodingHandlerOptionsKey]) {
			currentOptions = requestOptions[ParametersNameDecodingHandlerOptionsKey] as ParametersNameDecodingHandlerOptions;
		}
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("parametersNameDecodingHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.parameters_name_decoding.enable", currentOptions.enable);
					return this.decodeParameters(url, requestInit, currentOptions, requestOptions);
				} finally {
					span.end();
				}
			});
		}
		return this.decodeParameters(url, requestInit, currentOptions, requestOptions);
	}
	private decodeParameters(url: string, requestInit: RequestInit, currentOptions: ParametersNameDecodingHandlerOptions, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		let updatedUrl = url;
		if (currentOptions && currentOptions.enable && url.includes("%") && currentOptions.charactersToDecode && currentOptions.charactersToDecode.length > 0) {
			currentOptions.charactersToDecode.forEach((character) => {
				updatedUrl = updatedUrl.replace(new RegExp(`%${character.charCodeAt(0).toString(16)}`, "gi"), character);
			});
		}
		return this.next?.execute(updatedUrl, requestInit, requestOptions) ?? Promise.reject(new Error("The next middleware is not set."));
	}
}
