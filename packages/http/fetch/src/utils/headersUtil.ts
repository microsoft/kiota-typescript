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

/**
 * To get the request header from the request
 * @param options - The request options object
 * @param key - The header key string
 * @returns A header value for the given key from the request
 */
export const getRequestHeader = (options: FetchRequestInit | undefined, key: string): string | undefined => {
	if (options && options.headers) {
		return options.headers[key];
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
