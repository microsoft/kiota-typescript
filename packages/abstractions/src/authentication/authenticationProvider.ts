/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type RequestInformation } from "../requestInformation";

/**
 * Interface to be implemented to provide authentication information for a request.
 */
export interface AuthenticationProvider {
	/**
	 * Authenticates the application and returns a token base on the provided Uri.
	 * @param request the request to authenticate.
	 * @param {Record<string, unknown>} additionalAuthenticationContext - The additional authentication context to pass to the authentication library.
	 * @returns a Promise to await for the authentication to be completed.
	 */
	authenticateRequest: (request: RequestInformation, additionalAuthenticationContext?: Record<string, unknown>) => Promise<void>;
}
