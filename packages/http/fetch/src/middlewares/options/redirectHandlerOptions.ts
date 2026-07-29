/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module RedirectHandlerOptions
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";

/**
 *
 * A type declaration for shouldRetry callback
 */
export type ShouldRedirect = (response: Response) => boolean;

/**
 * A type declaration for scrubbing sensitive headers during redirects.
 * @param headers - The headers object to modify
 * @param originalUrl - The original request URL
 * @param newUrl - The new redirect URL
 */
export type ScrubSensitiveHeaders = (headers: Record<string, string>, originalUrl: string, newUrl: string) => void;

export const RedirectHandlerOptionKey = "RedirectHandlerOption";

export interface RedirectHandlerOptionsParams {
	maxRedirects?: number;
	shouldRedirect?: ShouldRedirect;
	scrubSensitiveHeaders?: ScrubSensitiveHeaders;
}

/**
 * The default implementation for scrubbing sensitive headers during redirects.
 * This function removes Authorization, Cookie, and Proxy-Authorization headers when the host or scheme changes.
 *
 * It is exported so that consumers providing a custom {@link ScrubSensitiveHeaders} callback can call it to
 * retain the default behavior and then layer additional logic on top (e.g. removing custom headers such as
 * `X-Api-Key`), matching the composable pattern available in the .NET and Python Kiota SDKs.
 *
 * Note: In browser environments, `Proxy-Authorization` is a forbidden header name and typically cannot be set;
 * it is still removed here if present (e.g. in Node.js or other non-browser runtimes).
 * @param headers - The headers object to modify
 * @param originalUrl - The original request URL
 * @param newUrl - The new redirect URL
 */
export const defaultScrubSensitiveHeaders: ScrubSensitiveHeaders = (headers: Record<string, string>, originalUrl: string, newUrl: string) => {
	if (!headers || !originalUrl || !newUrl) {
		return;
	}

	try {
		const originalUri = new URL(originalUrl);
		const newUri = new URL(newUrl);

		// Remove Authorization, Cookie, and Proxy-Authorization headers if the request's scheme or host changes.
		// Header keys must be matched case-insensitively because FetchRequestAdapter.getRequestFromRequestInformation
		// lower-cases every header key before the headers object reaches this middleware, so PascalCase
		// property deletes such as `delete headers.Authorization` would otherwise be a no-op.
		const isDifferentHostOrScheme = originalUri.host.toLowerCase() !== newUri.host.toLowerCase() || originalUri.protocol.toLowerCase() !== newUri.protocol.toLowerCase();

		if (isDifferentHostOrScheme) {
			for (const key of Object.keys(headers)) {
				const lower = key.toLowerCase();
				if (lower === "authorization" || lower === "cookie" || lower === "proxy-authorization") {
					delete headers[key];
				}
			}
		}
	} catch {
		// If URL parsing fails, don't modify headers
		// This handles cases where invalid URLs are passed
		return;
	}
};

/**
 * MiddlewareOptions
 * A class representing RedirectHandlerOptions
 */
export class RedirectHandlerOptions implements RequestOption {
	/**
	 * A member holding default max redirects value
	 */
	private static readonly DEFAULT_MAX_REDIRECTS = 5;

	/**
	 * A member holding maximum max redirects value
	 */
	private static readonly MAX_MAX_REDIRECTS = 20;

	/**
	 *
	 * A member holding default shouldRedirect callback
	 * @returns true
	 */
	private static readonly defaultShouldRetry: ShouldRedirect = () => true;

	/**
	 * The default {@link ScrubSensitiveHeaders} callback used when none is supplied.
	 * Delegates to the exported {@link defaultScrubSensitiveHeaders} function.
	 */
	private static readonly defaultScrubSensitiveHeaders: ScrubSensitiveHeaders = defaultScrubSensitiveHeaders;

	/**
	 *
	 * A member holding the max redirects value
	 */
	public maxRedirects: number;

	/**
	 *
	 * A member holding the should redirect callback
	 */
	public shouldRedirect: ShouldRedirect;

	/**
	 * A member holding the callback for scrubbing sensitive headers during redirects
	 */
	public scrubSensitiveHeaders: ScrubSensitiveHeaders;

	/**
	 *
	 * To create an instance of RedirectHandlerOptions
	 * @param [options] - The redirect handler options instance
	 * @returns An instance of RedirectHandlerOptions
	 * @throws Error if maxRedirects is more than 20 or less than 0
	 * @example	const options = new RedirectHandlerOptions({ maxRedirects: 5 });
	 */
	public constructor(options: Partial<RedirectHandlerOptionsParams> = {}) {
		if (options.maxRedirects && options.maxRedirects > RedirectHandlerOptions.MAX_MAX_REDIRECTS) {
			const error = new Error(`MaxRedirects should not be more than ${RedirectHandlerOptions.MAX_MAX_REDIRECTS}`);
			error.name = "MaxLimitExceeded";
			throw error;
		}
		if (options.maxRedirects !== undefined && options.maxRedirects < 0) {
			const error = new Error(`MaxRedirects should not be negative`);
			error.name = "MinExpectationNotMet";
			throw error;
		}
		this.maxRedirects = options.maxRedirects ?? RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS;
		this.shouldRedirect = options.shouldRedirect ?? RedirectHandlerOptions.defaultShouldRetry;
		this.scrubSensitiveHeaders = options.scrubSensitiveHeaders ?? RedirectHandlerOptions.defaultScrubSensitiveHeaders;
	}

	public getKey(): string {
		return RedirectHandlerOptionKey;
	}
}
