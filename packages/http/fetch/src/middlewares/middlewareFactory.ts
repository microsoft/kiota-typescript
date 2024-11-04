/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { CustomFetchHandler } from "./customFetchHandler";
import { HeadersInspectionHandler } from "./headersInspectionHandler";
import { Middleware } from "./middleware";
import { ParametersNameDecodingHandler } from "./parametersNameDecodingHandler";
import { RedirectHandler } from "./redirectHandler";
import { RetryHandler } from "./retryHandler";
import { UserAgentHandler } from "./userAgentHandler";
import { CompressionHandler } from "./compressionHandler";

/**
 *
 * Class containing function(s) related to the middleware pipelines.
 */
export class MiddlewareFactory {
	/**
	 * @param customFetch - The custom fetch implementation
	 * Returns the default middleware chain an array with the  middleware handlers
	 * @returns an array of the middleware handlers of the default middleware chain
	 */
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	public static getDefaultMiddlewares(customFetch: (request: string, init: RequestInit) => Promise<Response> = (...args) => fetch(...args) as any): Middleware[] {
		return [new RetryHandler(), new RedirectHandler(), new ParametersNameDecodingHandler(), new UserAgentHandler(), new CompressionHandler(), new HeadersInspectionHandler(), new CustomFetchHandler(customFetch)];
	}
}
