/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module ParametersNameDecodingHandlerOptions
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";

export const ParametersNameDecodingHandlerOptionsKey = "RetryHandlerOptionKey";

/** The ParametersNameDecodingOptions request class */
export class ParametersNameDecodingHandlerOptions implements RequestOption {
	getKey(): string {
		return ParametersNameDecodingHandlerOptionsKey;
	}

	/**
	 * @public
	 * @constructor
	 * To create an instance of ParametersNameDecodingHandlerOptions
	 * @param {boolean} [enable = true] - Whether to decode the specified characters in the request query parameters names
	 * @param {string[]} [charactersToDecode = [".", "-", "~", "$"]] - The characters to decode
	 */
	public constructor(public enable = true, public charactersToDecode: string[] = [".", "-", "~", "$"]) {}
}
