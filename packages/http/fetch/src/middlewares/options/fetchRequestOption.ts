/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type RequestOption } from "@microsoft/kiota-abstractions";

export const FetchRequestOptionKey = "FetchRequestOptionKey";

export type FetchCredentials = "omit" | "same-origin" | "include";
export type FetchMode = "cors" | "navigate" | "no-cors" | "same-origin";
export type FetchCache = "default" | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload";
export type FetchRedirect = "error" | "follow" | "manual";
export type FetchReferrerPolicy = "" | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";

/**
 * Signature to define the FetchRequestOption constructor parameters
 */
export interface FetchRequestOptionParams {
	/**
	 * A string indicating whether credentials will be sent with the request.
	 * Set to "include" to send cookies with cross-origin or secure cookie requests.
	 */
	credentials?: FetchCredentials;
	/**
	 * The mode of the request (e.g., cors, no-cors, same-origin, navigate).
	 */
	mode?: FetchMode;
	/**
	 * The cache mode of the request (e.g., default, no-store, reload, no-cache, force-cache, only-if-cached).
	 */
	cache?: FetchCache;
	/**
	 * The subresource integrity value of the request.
	 */
	integrity?: string;
	/**
	 * A boolean indicating whether the request may outlive the webpage.
	 */
	keepalive?: boolean;
	/**
	 * The redirect mode of the request (e.g., follow, error, manual).
	 */
	redirect?: FetchRedirect;
	/**
	 * The referrer of the request (e.g., client, no-referrer, or a URL).
	 */
	referrer?: string;
	/**
	 * The referrer policy of the request.
	 */
	referrerPolicy?: FetchReferrerPolicy;
	/**
	 * Additional arbitrary properties to include in the native RequestInit.
	 */
	init?: Record<string, unknown>;
}

/**
 * RequestOption
 * Options to configure native fetch RequestInit parameters (e.g. credentials, mode, cache, keepalive).
 */
export class FetchRequestOption implements RequestOption {
	/**
	 * A string indicating whether credentials will be sent with the request.
	 */
	public credentials?: FetchCredentials;
	/**
	 * The mode of the request.
	 */
	public mode?: FetchMode;
	/**
	 * The cache mode of the request.
	 */
	public cache?: FetchCache;
	/**
	 * The subresource integrity value of the request.
	 */
	public integrity?: string;
	/**
	 * A boolean indicating whether the request may outlive the webpage.
	 */
	public keepalive?: boolean;
	/**
	 * The redirect mode of the request.
	 */
	public redirect?: FetchRedirect;
	/**
	 * The referrer of the request.
	 */
	public referrer?: string;
	/**
	 * The referrer policy of the request.
	 */
	public referrerPolicy?: FetchReferrerPolicy;
	/**
	 * Additional arbitrary properties to include in the native RequestInit.
	 */
	public init?: Record<string, unknown>;

	/**
	 * To create an instance of FetchRequestOption
	 * @param [options] - The fetch request options value
	 * @returns An instance of FetchRequestOption
	 * @example const options = new FetchRequestOption({ credentials: "include" });
	 */
	public constructor(options: Partial<FetchRequestOptionParams> = {}) {
		this.credentials = options.credentials;
		this.mode = options.mode;
		this.cache = options.cache;
		this.integrity = options.integrity;
		this.keepalive = options.keepalive;
		this.redirect = options.redirect;
		this.referrer = options.referrer;
		this.referrerPolicy = options.referrerPolicy;
		this.init = options.init;
	}

	public getKey(): string {
		return FetchRequestOptionKey;
	}
}
