/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { RequestOption } from "./requestOption";
import type { ResponseHandler } from "./responseHandler";

export const ResponseHandlerOptionKey = "ResponseHandlerOptionKey";

/**
 * Options to intercept the request from the main pipeline.
 */
export class ResponseHandlerOption implements RequestOption {
	/**
	 * The response handler to be used when processing the response.
	 */
	public responseHandler?: ResponseHandler;
	public getKey(): string {
		return ResponseHandlerOptionKey;
	}
}
