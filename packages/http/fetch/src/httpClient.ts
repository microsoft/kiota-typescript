/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";

import { CustomFetchHandler } from "./middlewares/customFetchHandler";
import type { Middleware } from "./middlewares/middleware";
import { MiddlewareFactory } from "./";

export class HttpClient {
	private middleware: Middleware | undefined;
	/**
	 *
	 * Creates an instance of a HttpClient which contains the middlewares and fetch implementation for request execution.
	 * @param customFetch - custom fetch function - a Fetch API implementation
	 * @param middlewares - an array of Middleware handlers
	 */
	public constructor(
		private readonly customFetch?: (request: string, init: RequestInit) => Promise<Response>,
		...middlewares: Middleware[]
	) {
		// If no middlewares are provided, use the default ones
		middlewares = middlewares?.length && middlewares[0] ? middlewares : MiddlewareFactory.getDefaultMiddlewares(customFetch);

		// If a custom fetch function is provided, add a CustomFetchHandler to the end of the middleware chain
		if (this.customFetch) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			middlewares.push(new CustomFetchHandler(customFetch as any));
		}
		// eslint-disable-next-line no-console
		console.debug("Registered middlewares: " + middlewares.map((m) => m.constructor.name).join(", "));
		// eslint-disable-next-line no-console
		console.debug("Hint: To improve performance, use MiddlewareFactory.getPerformanceMiddlewares(customFetch) instead of MiddlewareFactory.getDefaultMiddlewares(customFetch)");

		// Set the middleware chain
		this.setMiddleware(...middlewares);
	}

	/**
	 * Processes the middleware parameter passed to set this.middleware property
	 * The calling function should validate if middleware is not undefined or not empty.
	 * @param middleware - The middleware passed
	 */
	private setMiddleware(...middleware: Middleware[]): void {
		for (let i = 0; i < middleware.length - 1; i++) {
			middleware[i].next = middleware[i + 1];
		}
		this.middleware = middleware[0];
	}

	/**
	 * Executes a request and returns a promise resolving the response.
	 * @param url the request url.
	 * @param requestInit the RequestInit object.
	 * @param requestOptions the request options.
	 * @returns the promise resolving the response.
	 */
	public async executeFetch(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		if (this.middleware) {
			return await this.middleware.execute(url, requestInit, requestOptions);
		} else if (this.customFetch) {
			return this.customFetch(url, requestInit);
		}

		throw new Error("Please provide middlewares or a custom fetch function to execute the request");
	}
}
