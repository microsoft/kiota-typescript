/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { inNodeEnv } from "../utils";
const localhostStrings: Set<string> = new Set<string>(["localhost", "[::1]", "::1", "127.0.0.1"]);

/**
 * Validates the protocol of the url.
 * @param url - The url to validate.
 */
export function validateProtocol(url: string): void {
	if (!isLocalhostUrl(url) && !url.toLocaleLowerCase().startsWith("https://") && !windowUrlStartsWithHttps()) {
		throw new Error("Authentication scheme can only be used with https requests");
	}
}

/**
 * Checks if the window url starts with https.
 * @returns True if the window url starts with https, false otherwise.
 */
function windowUrlStartsWithHttps(): boolean {
	if (!inNodeEnv()) {
		return window.location.protocol.toLocaleLowerCase() === "https:";
	}
	return false;
}

/**
 * Checks if the url is a localhost url.
 * @param urlString - The url to check.
 * @returns True if the url is a localhost url, false otherwise.
 */
export function isLocalhostUrl(urlString: string): boolean {
	try {
		const url = new URL(urlString);
		return localhostStrings.has(url.hostname);
	} catch {
		return false;
	}
}
