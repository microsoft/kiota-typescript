/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { FetchRequestInit } from "./fetchDefinitions";

/**
 * @module RedirectedUrl
 */

/**
 * The URL a redirect sent each request to, keyed by the request options object.
 * RedirectHandler updates the request options in place when it follows a redirect, so it records the new URL here too,
 * which lets a handler earlier in the chain resend the redirected request to the URL it was actually sent to.
 */
const redirectedUrls = new WeakMap<FetchRequestInit, string>();

/**
 * Records the URL a redirect sent the request to
 * @param fetchRequestInit - The request options, as updated for the redirect
 * @param url - The URL of the redirect target
 */
export const setRedirectedUrl = (fetchRequestInit: FetchRequestInit, url: string): void => {
	redirectedUrls.set(fetchRequestInit, url);
};

/**
 * Gets the URL a redirect sent the request to, if any
 * @param fetchRequestInit - The request options
 * @returns The URL of the last redirect target, or undefined if the request wasn't redirected
 */
export const getRedirectedUrl = (fetchRequestInit: FetchRequestInit): string | undefined => redirectedUrls.get(fetchRequestInit);

/**
 * Forgets any redirect recorded for the request
 * @param fetchRequestInit - The request options
 */
export const clearRedirectedUrl = (fetchRequestInit: FetchRequestInit): void => {
	redirectedUrls.delete(fetchRequestInit);
};
