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
import { deleteRequestHeader } from "../utils/headersUtil";
import type { Middleware } from "./middleware";
import { defaultScrubSensitiveHeaders, RedirectHandlerOptionKey, RedirectHandlerOptions } from "./options/redirectHandlerOptions";
import { isHeadersLike } from "../utils/headersUtil";

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
	 * A member holding redirect status codes that change POST requests to GET
	 */
	private static readonly STATUS_CODES_POST_TO_GET = new Set<number>([301, 302]);

	/**
	 * A member holding headers that describe a request body
	 */
	private static readonly BODY_HEADERS = new Set<string>(["content-length", "transfer-encoding", "content-type", "content-encoding", "content-language"]);

	/**
	 * A member holding the name of the location header
	 */
	private static readonly LOCATION_HEADER = "Location";

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
	 * Updates the request method and body to match Fetch redirect semantics.
	 * @param responseStatus - The redirect response status code
	 * @param fetchRequestInit - The Fetch RequestInit object
	 */
	private updateRequestForRedirect(responseStatus: number, fetchRequestInit: FetchRequestInit): void {
		const method = fetchRequestInit.method?.toUpperCase() ?? HttpMethod.GET;
		const shouldChangePostToGet = RedirectHandler.STATUS_CODES_POST_TO_GET.has(responseStatus) && method === "POST";
		const shouldChangeToGetForSeeOther = responseStatus === RedirectHandler.STATUS_CODE_SEE_OTHER && method !== "GET" && method !== "HEAD";

		if (!shouldChangePostToGet && !shouldChangeToGetForSeeOther) {
			return;
		}

		fetchRequestInit.method = HttpMethod.GET;
		delete fetchRequestInit.body;
		for (const header of RedirectHandler.BODY_HEADERS) {
			deleteRequestHeader(fetchRequestInit, header);
		}
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
			const redirectUrl = this.getLocationHeader(response);
			if (!redirectUrl) {
				return response;
			}

			// Resolve relative URLs
			const newUrl = this.isRelativeURL(redirectUrl) ? new URL(redirectUrl, url).toString() : redirectUrl;

			// Scrub sensitive headers before following the redirect
			if (fetchRequestInit.headers) {
				this.scrubHeaders(fetchRequestInit, currentOptions, url, newUrl);
			}

			this.updateRequestForRedirect(response.status, fetchRequestInit);

			url = newUrl;
			if (tracerName) {
				return await trace.getTracer(tracerName).startActiveSpan(`redirectHandler - redirect ${redirectCount}`, async (span) => {
					try {
						span.setAttribute("com.microsoft.kiota.handler.redirect.count", redirectCount);
						span.setAttribute("http.response.status_code", response.status);
						return await this.executeWithRedirect(url, fetchRequestInit, redirectCount, currentOptions, requestOptions, tracerName);
					} catch (error) {
						span.recordException(error as Error);
						throw error;
					} finally {
						span.end();
					}
				});
			}
			return await this.executeWithRedirect(url, fetchRequestInit, redirectCount, currentOptions, requestOptions, tracerName);
		} else {
			return response;
		}
	}

	/**
	 * Scrubs sensitive headers prior to following a redirect.
	 * If the configured scrubber is the default implementation, it operates directly on all
	 * HeadersInit formats (Headers, tuple arrays, and records) case-insensitively.
	 * If a custom scrubber adhering to the record-based ScrubSensitiveHeaders contract is configured,
	 * non-record header representations are adapted to a record and any modifications (deletions or updates)
	 * are propagated back to the underlying headers structure.
	 * @param fetchRequestInit - The fetch request init object.
	 * @param currentOptions - The redirect handler options.
	 * @param originalUrl - The original request URL.
	 * @param newUrl - The new redirect URL.
	 */
	private scrubHeaders(fetchRequestInit: FetchRequestInit, currentOptions: RedirectHandlerOptions, originalUrl: string, newUrl: string): void {
		const headers = fetchRequestInit.headers;
		if (!headers) {
			return;
		}

		if (currentOptions.scrubSensitiveHeaders === defaultScrubSensitiveHeaders) {
			defaultScrubSensitiveHeaders(headers, originalUrl, newUrl);
			return;
		}

		if (isHeadersLike(headers)) {
			const record: Record<string, string> = {};
			if (typeof headers.forEach === "function") {
				headers.forEach((value, key) => {
					record[key] = value;
				});
			} else if (typeof headers[Symbol.iterator] === "function") {
				for (const [key, value] of headers as Iterable<[string, string]>) {
					record[key] = value;
				}
			} else if (typeof headers.entries === "function") {
				for (const [key, value] of headers.entries()) {
					record[key] = value;
				}
			}
			const originalRecord = { ...record };
			currentOptions.scrubSensitiveHeaders(record, originalUrl, newUrl);
			const remainingKeysLower = new Set(Object.keys(record).map((k) => k.toLowerCase()));
			const toDelete: string[] = [];
			if (typeof headers.forEach === "function") {
				headers.forEach((_, key) => {
					if (!remainingKeysLower.has(key.toLowerCase())) {
						toDelete.push(key);
					}
				});
			} else if (typeof headers[Symbol.iterator] === "function") {
				for (const [key] of headers as Iterable<[string, string]>) {
					if (!remainingKeysLower.has(key.toLowerCase())) {
						toDelete.push(key);
					}
				}
			} else if (typeof headers.entries === "function") {
				for (const [key] of headers.entries()) {
					if (!remainingKeysLower.has(key.toLowerCase())) {
						toDelete.push(key);
					}
				}
			}
			for (const key of toDelete) {
				headers.delete(key);
			}
			for (const [key, value] of Object.entries(record)) {
				const origKey = Object.keys(originalRecord).find((k) => k.toLowerCase() === key.toLowerCase());
				if (!origKey || originalRecord[origKey] !== value) {
					headers.set(key, value);
				}
			}
		} else if (Array.isArray(headers)) {
			const tupleHeaders = headers as [string, string][];
			const record: Record<string, string> = {};
			for (const [key, value] of tupleHeaders) {
				const existingKey = Object.keys(record).find((k) => k.toLowerCase() === key.toLowerCase());
				if (existingKey) {
					record[existingKey] = `${record[existingKey]}, ${value}`;
				} else {
					record[key] = value;
				}
			}
			const originalRecord = { ...record };
			currentOptions.scrubSensitiveHeaders(record, originalUrl, newUrl);
			const remainingKeysLower = new Set(Object.keys(record).map((k) => k.toLowerCase()));
			for (let i = tupleHeaders.length - 1; i >= 0; i--) {
				const key = tupleHeaders[i][0];
				if (!remainingKeysLower.has(key.toLowerCase())) {
					tupleHeaders.splice(i, 1);
				}
			}
			for (const [key, value] of Object.entries(record)) {
				const origKey = Object.keys(originalRecord).find((k) => k.toLowerCase() === key.toLowerCase());
				if (!origKey) {
					tupleHeaders.push([key, value]);
				} else if (originalRecord[origKey] !== value) {
					const firstIdx = tupleHeaders.findIndex(([k]) => k.toLowerCase() === key.toLowerCase());
					if (firstIdx >= 0) {
						tupleHeaders[firstIdx] = [key, value];
						for (let i = tupleHeaders.length - 1; i > firstIdx; i--) {
							if (tupleHeaders[i][0].toLowerCase() === key.toLowerCase()) {
								tupleHeaders.splice(i, 1);
							}
						}
					} else {
						tupleHeaders.push([key, value]);
					}
				}
			}
		} else {
			currentOptions.scrubSensitiveHeaders(headers, originalUrl, newUrl);
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
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("redirectHandler - execute", async (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.redirect.enable", true);
					return await this.executeWithRedirect(url, requestInit as FetchRequestInit, redirectCount, currentOptions, requestOptions, obsOptions.getTracerInstrumentationName());
				} catch (error) {
					span.recordException(error as Error);
					throw error;
				} finally {
					span.end();
				}
			});
		}
		return this.executeWithRedirect(url, requestInit as FetchRequestInit, redirectCount, currentOptions, requestOptions);
	}
}
