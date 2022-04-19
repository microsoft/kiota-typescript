/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { RequestOption } from "@microsoft/kiota-abstractions";

import { Middleware } from "./middleware";
import { ParametersNameDecodingHandlerOptions, ParametersNameDecodingHandlerOptionsKey } from "./options/parametersNameDecodingOptions";

/**
 * @module ParametersNameDecodingHandler
 */

export class ParametersNameDecodingHandler implements Middleware {
	/**
	 * @public
	 * @constructor
	 * To create an instance of ParametersNameDecodingHandler
	 * @param {ParametersNameDecodingHandlerOptions} [options = new ParametersNameDecodingHandlerOptions()] - The parameters name decoding handler options value
	 */
	public constructor(private options: ParametersNameDecodingHandlerOptions = new ParametersNameDecodingHandlerOptions()) {
		if (!options) {
			throw new Error("The options parameter is required.");
		}
	}
	/** @inheritdoc */
	next: Middleware | undefined;
	/**
	 * @public
	 * @async
	 * To execute the current middleware
	 * @param {string} url - The url to be fetched
	 * @param {FetchRequestInit} requestInit - The request init object
	 * @param {Record<string, RequestOption>} [requestOptions] - The request options
	 * @returns A Promise that resolves to nothing
	 */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		let currentOptions = this.options;
		if (requestOptions && requestOptions[ParametersNameDecodingHandlerOptionsKey]) {
			currentOptions = requestOptions[ParametersNameDecodingHandlerOptionsKey] as ParametersNameDecodingHandlerOptions;
		}
		let updatedUrl = url;
		if (currentOptions && currentOptions.enable && url.indexOf("%") > -1 && currentOptions.charactersToDecode && currentOptions.charactersToDecode.length > 0) {
			currentOptions.charactersToDecode.forEach((character) => {
				updatedUrl = updatedUrl.replace(new RegExp(`%${character.charCodeAt(0).toString(16)}`, "gi"), character);
			});
		}
		return this.next?.execute(updatedUrl, requestInit, requestOptions) ?? Promise.reject(new Error("The next middleware is not set."));
	}
}
