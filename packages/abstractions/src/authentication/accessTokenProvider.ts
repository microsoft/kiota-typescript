/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type AllowedHostsValidator } from "./allowedHostsValidator";

/**
 * An AccessTokenProvider implementation retrieves an access token
 * to be used by an AuthenticationProvider implementation.
 */
export interface AccessTokenProvider {
	/**
	 * Retrieves an access token for the given target URL.
	 * @param {string} url - The target URL.
	 * @param {Record<string, unknown>} additionalAuthenticationContext - The additional authentication context to pass to the authentication library.
	 * @returns {Promise<string>} The access token.
	 */
	getAuthorizationToken: (url?: string, additionalAuthenticationContext?: Record<string, unknown>) => Promise<string>;
	/**
	 * Retrieves the allowed hosts validator.
	 * @returns {AllowedHostsValidator} The allowed hosts validator.
	 */
	getAllowedHostsValidator: () => AllowedHostsValidator;
}
