/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type RequestInformation } from "../requestInformation";

/**
 * @interface
 * Interface to be implementated to provide authentication information for a request.
 * @property {Function} authenticateRequest - The function to authenticate the request.
 */
export interface AuthenticationProvider {
	/**
	 * Authenticates the application and returns a token base on the provided Uri.
	 * @param request the request to authenticate.
	 * @param {Record<string, unknown>} - The additional authentication context to pass to the authentication library.
	 * @return a Promise to await for the authentication to be completed.
	 */
	authenticateRequest: (request: RequestInformation, additionalAuthenticationContext?: Record<string, unknown>) => Promise<void>;
}
