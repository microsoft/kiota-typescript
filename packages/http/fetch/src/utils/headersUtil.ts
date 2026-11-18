/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { FetchRequestInit } from "./fetchDefinitions";

/**
 * @module MiddlewareUtil
 */

interface HeadersLike {
	get(name: string): string | null;
	set(name: string, value: string): void;
	delete(name: string): void;
}

const isHeadersLike = (headers: unknown): headers is HeadersLike => {
	return typeof headers === "object" && headers !== null && typeof (headers as Partial<HeadersLike>).get === "function" && typeof (headers as Partial<HeadersLike>).set === "function" && typeof (headers as Partial<HeadersLike>).delete === "function";
};

/**
 * To get the request header from the request
 * @param options - The request options object
 * @param key - The header key string
 * @returns A header value for the given key from the request
 */
export const getRequestHeader = (options: FetchRequestInit | RequestInit | undefined, key: string): string | undefined => {
	const headers = options?.headers;
	if (!headers || !key) {
		return undefined;
	}
	if (isHeadersLike(headers)) {
		const value = headers.get(key);
		return value !== null ? value : undefined;
	}
	const lowerKey = key.toLowerCase();
	if (Array.isArray(headers)) {
		const values: string[] = [];
		for (const entry of headers) {
			if (Array.isArray(entry) && typeof entry[0] === "string" && entry[0].toLowerCase() === lowerKey) {
				values.push(entry[1]);
			}
		}
		return values.length > 0 ? values.join(", ") : undefined;
	}
	const record = headers as Record<string, string>;
	if (Object.prototype.hasOwnProperty.call(record, key)) {
		return record[key];
	}
	for (const existingKey of Object.keys(record)) {
		if (existingKey.toLowerCase() === lowerKey) {
			return record[existingKey];
		}
	}
	return undefined;
};

/**
 * To set the header value to the given request
 * @param options - The request options object
 * @param key - The header key string
 * @param value - The header value string
 */
export const setRequestHeader = (options: FetchRequestInit | undefined, key: string, value: string): void => {
	if (options) {
		if (!options.headers) {
			options.headers = {};
		}
		options.headers[key] = value;
	}
};

/**
 * To delete the header key to the given request
 * @param options - The request options object
 * @param key - The header key string
 */
export const deleteRequestHeader = (options: FetchRequestInit | undefined, key: string): void => {
	if (options) {
		if (!options.headers) {
			options.headers = {};
		}
		delete options.headers[key];
	}
};

/**
 * To append the header value to the given request
 * @param options - The request options object
 * @param key - The header key string
 * @param value - The header value string
 * @param separator - The separator string
 */
export const appendRequestHeader = (options: FetchRequestInit | undefined, key: string, value: string, separator = ", "): void => {
	if (options) {
		if (!options.headers) {
			options.headers = {};
		}
		if (!options.headers[key]) {
			options.headers[key] = value;
		} else {
			options.headers[key] += `${separator}${value}`;
		}
	}
};
