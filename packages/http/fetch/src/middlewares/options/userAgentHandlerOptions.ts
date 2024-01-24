/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";

import { libraryVersion } from "./version";
export const UserAgentHandlerOptionsKey = "UserAgentHandlerOptionKey";

/**
 * @interface
 * Signature to define the user agent handler options
 * @property {boolean} [enable = true] - Whether to add the user agent header to the request
 * @property {string} [productName = "kiota-typescript"] - The product name to be added to the user agent header
 * @property {string} [productVersion = "1.0.0-preview.12"] - The product version to be added to the user agent header
 */
/**
 * Represents the options for the UserAgentHandler.
 */
export interface UserAgentHandlerOptionsParams {
	/**
	 * @member
	 * @default true
	 * Specifies whether to add the user agent header to the request
	 */
	enable?: boolean;
	/**
	 * @member
	 * @default "kiota-typescript"
	 * The product name to be added to the user agent header
	 */
	productName?: string;
	/**
	 * @member
	 * @default "1.0.0-preview.12"
	 * The product version to be added to the user agent header
	 */
	productVersion?: string;
}

/**
 * Represents the options for the UserAgentHandler.
 */
export class UserAgentHandlerOptions implements RequestOption {
	/**
	 * @member
	 * Specifies whether to add the user agent header to the request
	 */
	public enable: boolean;

	/**
	 * @member
	 * @default "kiota-typescript"
	 * The product name to be added to the user agent header
	 */
  	public productName: string;

	/**
	 * @member
	 * The product version to be added to the user agent header
	 */
  	public productVersion: string;

	getKey(): string {
		return UserAgentHandlerOptionsKey;
	}

	/**
	 * @public
	 * @constructor
	 * To create an instance of UserAgentHandlerOptions
	 * @param {UserAgentHandlerOptionsParams} [options = {}] - The options for the UserAgentHandler
	 * @example	const options = new UserAgentHandlerOptions({ enable: false });
	 */
	public constructor(options: Partial<UserAgentHandlerOptionsParams> = {}) {
		this.enable = options.enable ?? true;
		this.productName = options.productName ?? "kiota-typescript";
		this.productVersion = options.productVersion ?? libraryVersion;
	}
}
