/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
export type Guid = string;

const guidValidator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

/**
 * Checks if the string is a valid GUID.
 * @param source the string to check.
 * @returns unchanged string if it is a valid GUID; otherwise, undefined.
 */
export const parseGuidString = (source?: string) => {
	if (source && guidValidator.test(source)) {
		return source;
	}
	return undefined;
};

/**
 * Generates a GUID.
 * @returns a GUID.
 */
export const createGuid = () => [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");

/**
 * Generates a part of a GUID.
 * @param count the number of 2 byte chunks to generate.
 * @returns a part of a GUID.
 */
const gen = (count: number) => {
	let out = "";
	for (let i = 0; i < count; i++) {
		// eslint-disable-next-line no-bitwise
		out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return out;
};
