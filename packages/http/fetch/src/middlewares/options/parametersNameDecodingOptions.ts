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
	/**
	 * @member
	 * Whether to decode the specified characters in the request query parameters names
	 * * @default true
	 */
	enable?: boolean;
	/**
	 * @member
	 * The characters to decode
	 * @default [".", "-", "~", "$"]
	 */
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
	 * @default [".", "-", "~", "$"]
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
	 * @returns An instance of ParametersNameDecodingHandlerOptions
	 * @example ParametersNameDecodingHandlerOptions({ enable: true, charactersToDecode: [".", "-", "~", "$"] });
	 */
	public constructor(options: Partial<ParametersNameDecodingHandlerOptionsParams> = {}) {
		this.enable = options.enable ?? true;
		this.charactersToDecode = options.charactersToDecode ?? [".", "-", "~", "$"];
	}
}
