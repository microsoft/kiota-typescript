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
 *
 * Represents the options for the UserAgentHandler.
 */
export interface UserAgentHandlerOptionsParams {
	/**
	 * @default true
	 * Specifies whether to add the user agent header to the request
	 */
	enable?: boolean;
	/**
	 * @default "kiota-typescript"
	 * The product name to be added to the user agent header
	 */
	productName?: string;
	/**
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
	 * Specifies whether to add the user agent header to the request
	 */
	public enable: boolean;

	/**
	 * @default "kiota-typescript"
	 * The product name to be added to the user agent header
	 */
	public productName: string;

	/**
	 * The product version to be added to the user agent header
	 */
	public productVersion: string;

	getKey(): string {
		return UserAgentHandlerOptionsKey;
	}

	/**
	 *
	 * To create an instance of UserAgentHandlerOptions
	 * @param [options] - The options for the UserAgentHandler
	 * @example	const options = new UserAgentHandlerOptions({ enable: false });
	 */
	public constructor(options: Partial<UserAgentHandlerOptionsParams> = {}) {
		this.enable = options.enable ?? true;
		this.productName = options.productName ?? "kiota-typescript";
		this.productVersion = options.productVersion ?? libraryVersion;
	}
}
