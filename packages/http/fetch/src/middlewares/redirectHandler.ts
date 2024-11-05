/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module RedirectHandler
 */

import { HttpMethod, type RequestOption } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { FetchRequestInit, FetchResponse } from "../utils/fetchDefinitions";
import type { Middleware } from "./middleware";
import { RedirectHandlerOptionKey, RedirectHandlerOptions } from "./options/redirectHandlerOptions";

/**
 *
 * Class
 * Middleware
 * Class representing RedirectHandler
 */
export class RedirectHandler implements Middleware {
	/**
	 * A member holding the array of redirect status codes
	 */
	private static readonly REDIRECT_STATUS_CODES = new Set<number>([
		301, // Moved Permanently
		302, // Found
		303, // See Other
		307, // Temporary Permanently
		308, // Moved Permanently
	]);

	/**
	 * A member holding SeeOther status code
	 */
	private static readonly STATUS_CODE_SEE_OTHER = 303;

	/**
	 * A member holding the name of the location header
	 */
	private static readonly LOCATION_HEADER = "Location";

	/**
	 * A member representing the authorization header name
	 */
	private static readonly AUTHORIZATION_HEADER = "Authorization";

	/**
	 * A member holding the manual redirect value
	 */
	private static readonly MANUAL_REDIRECT = "manual";

	/** Next middleware to be executed*/
	next: Middleware | undefined;
	/**
	 *
	 *
	 * To create an instance of RedirectHandler
	 * @param [options] - The redirect handler options instance
	 * @returns An instance of RedirectHandler
	 */
	public constructor(private readonly options: RedirectHandlerOptions = new RedirectHandlerOptions()) {
		if (!options) {
			throw new Error("The options parameter is required.");
		}
	}

	/**
	 *
	 * To check whether the response has the redirect status code or not
	 * @param response - The response object
	 * @returns A boolean representing whether the response contains the redirect status code or not
	 */
	private isRedirect(response: FetchResponse): boolean {
		return RedirectHandler.REDIRECT_STATUS_CODES.has(response.status);
	}

	/**
	 *
	 * To check whether the response has location header or not
	 * @param response - The response object
	 * @returns A boolean representing the whether the response has location header or not
	 */
	private hasLocationHeader(response: FetchResponse): boolean {
		return response.headers.has(RedirectHandler.LOCATION_HEADER);
	}

	/**
	 *
	 * To get the redirect url from location header in response object
	 * @param response - The response object
	 * @returns A redirect url from location header
	 */
	private getLocationHeader(response: FetchResponse): string | null {
		return response.headers.get(RedirectHandler.LOCATION_HEADER);
	}

	/**
	 *
	 * To check whether the given url is a relative url or not
	 * @param url - The url string value
	 * @returns A boolean representing whether the given url is a relative url or not
	 */
	private isRelativeURL(url: string): boolean {
		return !url.includes("://");
	}

	/**
	 *
	 * To check whether the authorization header in the request should be dropped for consequent redirected requests
	 * @param requestUrl - The request url value
	 * @param redirectUrl - The redirect url value
	 * @returns A boolean representing whether the authorization header in the request should be dropped for consequent redirected requests
	 */
	private shouldDropAuthorizationHeader(requestUrl: string, redirectUrl: string): boolean {
		const schemeHostRegex = /^[A-Za-z].+?:\/\/.+?(?=\/|$)/;
		const requestMatches: string[] = schemeHostRegex.exec(requestUrl) as string[];
		let requestAuthority: string | undefined;
		let redirectAuthority: string | undefined;
		if (requestMatches !== null) {
			requestAuthority = requestMatches[0];
		}
		const redirectMatches: string[] = schemeHostRegex.exec(redirectUrl) as string[];
		if (redirectMatches !== null) {
			redirectAuthority = redirectMatches[0];
		}
		return typeof requestAuthority !== "undefined" && typeof redirectAuthority !== "undefined" && requestAuthority !== redirectAuthority;
	}

	/**
	 * To execute the next middleware and to handle in case of redirect response returned by the server
	 * @param url - The url string value
	 * @param fetchRequestInit - The Fetch RequestInit object
	 * @param redirectCount - The redirect count value
	 * @param currentOptions - The redirect handler options instance
	 * @param requestOptions - The request options
	 * @param tracerName - The name to use for the tracer
	 * @returns A promise that resolves to nothing
	 */
	private async executeWithRedirect(url: string, fetchRequestInit: FetchRequestInit, redirectCount: number, currentOptions: RedirectHandlerOptions, requestOptions?: Record<string, RequestOption>, tracerName?: string): Promise<FetchResponse> {
		const response = await this.next?.execute(url, fetchRequestInit as RequestInit, requestOptions);
		if (!response) {
			throw new Error("Response is undefined");
		}
		if (redirectCount < currentOptions.maxRedirects && this.isRedirect(response) && this.hasLocationHeader(response) && currentOptions.shouldRedirect(response)) {
			++redirectCount;
			if (response.status === RedirectHandler.STATUS_CODE_SEE_OTHER) {
				fetchRequestInit.method = HttpMethod.GET;
				delete fetchRequestInit.body;
			} else {
				const redirectUrl = this.getLocationHeader(response);
				if (redirectUrl) {
					if (fetchRequestInit.headers && !this.isRelativeURL(redirectUrl) && this.shouldDropAuthorizationHeader(url, redirectUrl)) {
						delete fetchRequestInit.headers[RedirectHandler.AUTHORIZATION_HEADER];
					}
					url = redirectUrl;
				}
			}
			if (tracerName) {
				return trace.getTracer(tracerName).startActiveSpan(`redirectHandler - redirect ${redirectCount}`, (span) => {
					try {
						span.setAttribute("com.microsoft.kiota.handler.redirect.count", redirectCount);
						span.setAttribute("http.response.status_code", response.status);
						return this.executeWithRedirect(url, fetchRequestInit, redirectCount, currentOptions, requestOptions);
					} finally {
						span.end();
					}
				});
			}
			return await this.executeWithRedirect(url, fetchRequestInit, redirectCount, currentOptions, requestOptions);
		} else {
			return response;
		}
	}

	/**
	 * Executes the request and returns a promise resolving the response.
	 * @param url - The url for the request
	 * @param requestInit - The Fetch RequestInit object.
	 * @param requestOptions - The request options.
	 * @returns A Promise that resolves to the response.
	 */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		const redirectCount = 0;
		let currentOptions = this.options;
		if (requestOptions?.[RedirectHandlerOptionKey]) {
			currentOptions = requestOptions[RedirectHandlerOptionKey] as RedirectHandlerOptions;
		}
		(requestInit as FetchRequestInit).redirect = RedirectHandler.MANUAL_REDIRECT;
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("redirectHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.redirect.enable", true);
					return this.executeWithRedirect(url, requestInit as FetchRequestInit, redirectCount, currentOptions, requestOptions, obsOptions.getTracerInstrumentationName());
				} finally {
					span.end();
				}
			});
		}
		return this.executeWithRedirect(url, requestInit as FetchRequestInit, redirectCount, currentOptions, requestOptions);
	}
}
