/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
export const inBrowserEnv = (): boolean => {
	try {
		return !!Buffer && !!process;
	} catch (err) {
		return err instanceof ReferenceError;
	}
};
