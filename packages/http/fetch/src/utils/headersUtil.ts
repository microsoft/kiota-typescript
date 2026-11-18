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
export const setRequestHeader = (options: FetchRequestInit | RequestInit | undefined, key: string, value: string): void => {
	if (!options || !key) {
		return;
	}
	if (!options.headers) {
		options.headers = { [key]: value };
		return;
	}
	if (isHeadersLike(options.headers)) {
		options.headers.set(key, value);
		return;
	}
	const lowerKey = key.toLowerCase();
	if (Array.isArray(options.headers)) {
		const entries = options.headers;
		let firstIndex = -1;
		for (let i = 0; i < entries.length; i++) {
			if (Array.isArray(entries[i]) && typeof entries[i][0] === "string" && entries[i][0].toLowerCase() === lowerKey) {
				firstIndex = i;
				break;
			}
		}
		if (firstIndex === -1) {
			entries.push([key, value]);
			return;
		}
		entries[firstIndex] = [key, value];
		for (let i = entries.length - 1; i > firstIndex; i--) {
			if (Array.isArray(entries[i]) && typeof entries[i][0] === "string" && entries[i][0].toLowerCase() === lowerKey) {
				entries.splice(i, 1);
			}
		}
		return;
	}
	const record = options.headers as Record<string, string>;
	for (const existingKey of Object.keys(record)) {
		if (existingKey !== key && existingKey.toLowerCase() === lowerKey) {
			delete record[existingKey];
		}
	}
	record[key] = value;
};

/**
 * To delete the header key to the given request
 * @param options - The request options object
 * @param key - The header key string
 */
export const deleteRequestHeader = (options: FetchRequestInit | RequestInit | undefined, key: string): void => {
	if (!options?.headers || !key) {
		return;
	}
	if (isHeadersLike(options.headers)) {
		options.headers.delete(key);
		return;
	}
	const lowerKey = key.toLowerCase();
	if (Array.isArray(options.headers)) {
		const entries = options.headers;
		for (let i = entries.length - 1; i >= 0; i--) {
			if (Array.isArray(entries[i]) && typeof entries[i][0] === "string" && entries[i][0].toLowerCase() === lowerKey) {
				entries.splice(i, 1);
			}
		}
		return;
	}
	const record = options.headers as Record<string, string>;
	for (const existingKey of Object.keys(record)) {
		if (existingKey.toLowerCase() === lowerKey) {
			delete record[existingKey];
		}
	}
};

/**
 * To append the header value to the given request
 * @param options - The request options object
 * @param key - The header key string
 * @param value - The header value string
 * @param separator - The separator string
 */
export const appendRequestHeader = (options: FetchRequestInit | RequestInit | undefined, key: string, value: string, separator = ", "): void => {
	if (!options || !key) {
		return;
	}
	if (!options.headers) {
		options.headers = { [key]: value };
		return;
	}
	if (isHeadersLike(options.headers)) {
		const existing = options.headers.get(key);
		options.headers.set(key, existing === null || existing === "" ? value : `${existing}${separator}${value}`);
		return;
	}
	const lowerKey = key.toLowerCase();
	if (Array.isArray(options.headers)) {
		const entries = options.headers;
		let firstIndex = -1;
		const tupleValues: string[] = [];
		for (let i = 0; i < entries.length; i++) {
			if (Array.isArray(entries[i]) && typeof entries[i][0] === "string" && entries[i][0].toLowerCase() === lowerKey) {
				if (firstIndex === -1) {
					firstIndex = i;
				}
				if (entries[i][1]) {
					tupleValues.push(entries[i][1]);
				}
			}
		}
		if (firstIndex === -1) {
			entries.push([key, value]);
			return;
		}
		for (let i = entries.length - 1; i > firstIndex; i--) {
			if (Array.isArray(entries[i]) && typeof entries[i][0] === "string" && entries[i][0].toLowerCase() === lowerKey) {
				entries.splice(i, 1);
			}
		}
		entries[firstIndex] = [key, tupleValues.length > 0 ? `${tupleValues.join(separator)}${separator}${value}` : value];
		return;
	}
	const record = options.headers as Record<string, string>;
	const existingValues: string[] = [];
	for (const existingKey of Object.keys(record)) {
		if (existingKey.toLowerCase() === lowerKey) {
			if (record[existingKey]) {
				existingValues.push(record[existingKey]);
			}
			if (existingKey !== key) {
				delete record[existingKey];
			}
		}
	}
	record[key] = existingValues.length > 0 ? `${existingValues.join(separator)}${separator}${value}` : value;
};
