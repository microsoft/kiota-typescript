/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * Checks if the runtime is in a browser or node environment.
 * @returns true if in node, else false as it is running in a browser.
 */
export const inNodeEnv = (): boolean => {
	try {
		return !!Buffer && !!process;
	} catch (err) {
		// ReferenceError is thrown if you use node js APIs in a browser,
		// cast it to a false if that's the case.
		return !(err instanceof ReferenceError);
	}
};
