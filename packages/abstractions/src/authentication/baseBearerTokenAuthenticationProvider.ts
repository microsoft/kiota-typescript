/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { Headers } from "../headers";
import { type RequestInformation } from "../requestInformation";
import type { AccessTokenProvider } from "./accessTokenProvider";
import type { AuthenticationProvider } from "./authenticationProvider";

/** Provides a base class for implementing AuthenticationProvider for Bearer token scheme. */
export class BaseBearerTokenAuthenticationProvider implements AuthenticationProvider {
	private static get authorizationHeaderKey() { return "Authorization"; }

	/**
	 *
	 * @param accessTokenProvider
	 */
	public constructor(public readonly accessTokenProvider: AccessTokenProvider) {}

	public authenticateRequest = async (request: RequestInformation, additionalAuthenticationContext?: Record<string, unknown>): Promise<void> => {
		if (!request) {
			throw new Error("request info cannot be null");
		}
		if (additionalAuthenticationContext?.claims && request.headers.has(BaseBearerTokenAuthenticationProvider.authorizationHeaderKey)) {
			request.headers.delete(BaseBearerTokenAuthenticationProvider.authorizationHeaderKey);
		}
		if (!request.headers || !request.headers.has(BaseBearerTokenAuthenticationProvider.authorizationHeaderKey)) {
			const token = await this.accessTokenProvider.getAuthorizationToken(request.URL, additionalAuthenticationContext);
			if (!request.headers) {
				request.headers = new Headers();
			}
			if (token) {
				request.headers.add(BaseBearerTokenAuthenticationProvider.authorizationHeaderKey, `Bearer ${token}`);
			}
		}
	};
}
