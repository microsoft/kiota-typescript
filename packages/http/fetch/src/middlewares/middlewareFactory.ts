/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { inNodeEnv } from "@microsoft/kiota-abstractions";
import { MiddlewareFactory as BrowserMiddlewareFactory } from "./browser/middlewareFactory";
import { Middleware } from "./middleware";
import { RedirectHandler } from "./redirectHandler";
import { RetryHandler } from "./retryHandler";

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

	public static getDefaultMiddlewares(customFetch: (request: string, init: RequestInit) => Promise<Response> = (...args) => fetch(...args)): Middleware[] {
		return MiddlewareFactory.addRedirectHandler(BrowserMiddlewareFactory.getDefaultMiddlewares(customFetch));
	}
	/**
	 * @param customFetch - The custom fetch implementation
	 * Returns the default middleware chain + performance middleware
	 * @returns an array of the middleware handlers of the default + performance middleware chain
	 */

	public static getPerformanceMiddlewares(customFetch: (request: string, init: RequestInit) => Promise<Response> = (...args) => fetch(...args)): Middleware[] {
		return MiddlewareFactory.addRedirectHandler(BrowserMiddlewareFactory.getPerformanceMiddlewares(customFetch));
	}

	private static addRedirectHandler(middlewares: Middleware[]): Middleware[] {
		// Browser Fetch follows redirects itself and hides manual redirect responses.
		if (inNodeEnv()) {
			const retryIndex = middlewares.findIndex((handler) => handler instanceof RetryHandler);
			middlewares.splice(retryIndex, 0, new RedirectHandler());
		}
		return middlewares;
	}
}
