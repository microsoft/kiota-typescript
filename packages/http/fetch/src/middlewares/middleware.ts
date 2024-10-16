/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { RequestOption } from "@microsoft/kiota-abstractions";
// use import types
/** Defines the contract for a middleware in the request execution pipeline. */
export interface Middleware {
	/** Next middleware to be executed. The current middleware must execute it in its implementation. */
	next: Middleware | undefined;

	/**
	 * @public
	 * @async
	 * Main method of the middleware.
	 * @param requestInit The Fetch RequestInit object.
	 * @param url The URL of the request.
	 * @return A promise that resolves to the response object.
	 */
	execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response>;
}
