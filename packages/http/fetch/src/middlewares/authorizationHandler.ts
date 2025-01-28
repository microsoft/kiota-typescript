/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type RequestOption } from "@microsoft/kiota-abstractions";
import { Span, trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { Middleware } from "./middleware";
import type { FetchRequestInit } from "../utils/fetchDefinitions";
import { getRequestHeader, setRequestHeader } from "../utils/headersUtil";
import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";

export class AuthorizationHandler implements Middleware {
	next: Middleware | undefined;

	/**
	 * A member holding the name of content range header
	 */
	private static readonly AUTHORIZATION_HEADER = "Authorization";

	public constructor(private readonly authenticationProvider: BaseBearerTokenAuthenticationProvider) {
		if (!authenticationProvider) {
			throw new Error("authenticationProvider cannot be undefined");
		}
	}

	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("authorizationHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.authorization.enable", true);
					return this.executeInternal(url, requestInit as FetchRequestInit, requestOptions, span);
				} finally {
					span.end();
				}
			});
		}
		return this.executeInternal(url, requestInit as FetchRequestInit, requestOptions, undefined);
	}

	private async executeInternal(url: string, fetchRequestInit: FetchRequestInit, requestOptions?: Record<string, RequestOption>, span?: Span): Promise<Response> {
		if (this.authorizationIsPresent(fetchRequestInit)) {
			span?.setAttribute("com.microsoft.kiota.handler.authorization.token_present", true);
			return await this.next!.execute(url, fetchRequestInit as RequestInit, requestOptions);
		}

		const token = await this.authenticateRequest(url);
		setRequestHeader(fetchRequestInit, AuthorizationHandler.AUTHORIZATION_HEADER, `Bearer ${token}`);
		const response = await this.next?.execute(url, fetchRequestInit as RequestInit, requestOptions);
		if (!response) {
			throw new Error("Response is undefined");
		}
		if (response.status !== 401) {
			return response;
		}
		const claims = this.getClaimsFromResponse(response);
		if (!claims) {
			return response;
		}
		span?.addEvent("com.microsoft.kiota.handler.authorization.challenge_received");
		const claimsToken = await this.authenticateRequest(url, claims);
		setRequestHeader(fetchRequestInit, AuthorizationHandler.AUTHORIZATION_HEADER, `Bearer ${claimsToken}`);
		span?.setAttribute("http.request.resend_count", 1);
		const retryResponse = await this.next?.execute(url, fetchRequestInit as RequestInit, requestOptions);
		if (!retryResponse) {
			throw new Error("Response is undefined");
		}
		return retryResponse;
	}

	private authorizationIsPresent(request: FetchRequestInit | undefined): boolean {
		if (!request) {
			return false;
		}
		const authorizationHeader = getRequestHeader(request, AuthorizationHandler.AUTHORIZATION_HEADER);
		return authorizationHeader !== undefined && authorizationHeader !== null;
	}

	private async authenticateRequest(url: string, claims?: string): Promise<string> {
		const additionalAuthenticationContext = {} as Record<string, unknown>;
		if (claims) {
			additionalAuthenticationContext.claims = claims;
		}
		return await this.authenticationProvider.getAccessTokenProvider().getAuthorizationToken(url, additionalAuthenticationContext);
	}

	private readonly getClaimsFromResponse = (response: Response, claims?: string) => {
		if (response.status === 401 && !claims) {
			// avoid infinite loop, we only retry once
			// no need to check for the content since it's an array and it doesn't need to be rewound
			const rawAuthenticateHeader = response.headers.get("WWW-Authenticate");
			if (rawAuthenticateHeader && /^Bearer /gi.test(rawAuthenticateHeader)) {
				const rawParameters = rawAuthenticateHeader.replace(/^Bearer /gi, "").split(",");
				for (const rawParameter of rawParameters) {
					const trimmedParameter = rawParameter.trim();
					if (/claims="[^"]+"/gi.test(trimmedParameter)) {
						return trimmedParameter.replace(/claims="([^"]+)"/gi, "$1");
					}
				}
			}
		}
		return undefined;
	};
}
