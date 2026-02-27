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
	 * The default implementation for scrubbing sensitive headers during redirects.
	 * This method removes Authorization and Cookie headers when the host or scheme changes.
	 * Note: Proxy-Authorization handling is not applicable in Fetch API as proxy configuration
	 * is handled at a lower level by the browser/runtime and is not accessible to JavaScript.
	 * @param headers - The headers object to modify
	 * @param originalUrl - The original request URL
	 * @param newUrl - The new redirect URL
	 */
	private static readonly defaultScrubSensitiveHeaders: ScrubSensitiveHeaders = (headers: Record<string, string>, originalUrl: string, newUrl: string) => {
		if (!headers || !originalUrl || !newUrl) {
			return;
		}

		const originalUri = new URL(originalUrl);
		const newUri = new URL(newUrl);

		// Remove Authorization and Cookie headers if the request's scheme or host changes
		const isDifferentHostOrScheme = originalUri.host.toLowerCase() !== newUri.host.toLowerCase() || originalUri.protocol.toLowerCase() !== newUri.protocol.toLowerCase();

		if (isDifferentHostOrScheme) {
			delete headers.Authorization;
			delete headers.Cookie;
		}

		// Note: Proxy-Authorization is not handled here as proxy configuration in Fetch API
		// is managed by the browser/runtime and not accessible to JavaScript code.
		// In environments where this matters (e.g., Node.js with custom agents), the proxy
		// configuration should be managed at the HTTP client level.
	};

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
