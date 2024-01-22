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

/**
 * @interface
 * Signature to define the ParametersNameDecodingHandlerOptions constructor parameters
 */
export interface ParametersNameDecodingHandlerOptionsParams {
	enable?: boolean;
	charactersToDecode?: string[];
}

/** The ParametersNameDecodingOptions request class */
export class ParametersNameDecodingHandlerOptions implements RequestOption {
	/**
	 * @public
	 * Whether to decode the specified characters in the request query parameters names
	 */
	public enable: boolean;

	/**
	 * @public
	 * The characters to decode
	 * @remarks	These characters are decoded by default: [".", "-", "~", "$"]
	 */
	public charactersToDecode: string[];

	getKey(): string {
		return ParametersNameDecodingHandlerOptionsKey;
	}

	/**
	 * @public
	 * @constructor
	 * To create an instance of ParametersNameDecodingHandlerOptions
	 * @param {ParametersNameDecodingHandlerOptionsParams} [options = {}] - The optional parameters
	 */
	public constructor(
		options: ParametersNameDecodingHandlerOptionsParams = {} as ParametersNameDecodingHandlerOptionsParams,
	  ) {
		this.enable = options.enable ?? true;
		this.charactersToDecode = options.charactersToDecode ?? [".", "-", "~", "$"];
	  }
}
