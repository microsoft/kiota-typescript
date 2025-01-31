/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { Middleware, MiddlewareFactory } from ".";
import { HttpClient } from "./httpClient";
import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";
import { AuthorizationHandler } from "./middlewares/authorizationHandler";

/**
 *
 * Class containing function(s) related to the middleware pipelines.
 */
export class KiotaClientFactory {
	/**
	 * Returns an instance of HttpClient with the provided middlewares and custom fetch implementation both parameters are optional.
	 * if not provided, the default fetch implementation and middlewares will be used.
	 * @param customFetch - a Fetch API implementation
	 * @param middlewares - an aray of Middleware handlers
	 * If middlewares param is undefined, the httpClient instance will use the default array of middlewares.
	 * Set middlewares to `null` if you do not wish to use middlewares.
	 * If custom fetch is undefined, the httpClient instance uses the `DefaultFetchHandler`
	 * @param authenticationProvider - an optional instance of BaseBearerTokenAuthenticationProvider to be used for authentication
	 * @returns a HttpClient instance
	 * @example
	 * ```Typescript
	 * // Example usage of KiotaClientFactory.create method with both customFetch and middlewares parameters provided
	 *  KiotaClientFactory.create(customFetch, [middleware1, middleware2]);
	 * ```
	 * @example
	 * ```Typescript
	 * // Example usage of KiotaClientFactory.create method with only customFetch parameter provided
	 * KiotaClientFactory.create(customFetch);
	 * ```
	 * @example
	 * ```Typescript
	 * // Example usage of KiotaClientFactory.create method with only middlewares parameter provided
	 * KiotaClientFactory.create(undefined, [middleware1, middleware2]);
	 * ```
	 * @example
	 * ```Typescript
	 * // Example usage of KiotaClientFactory.create method with no parameters provided
	 * KiotaClientFactory.create();
	 * ```
	 */
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	public static create(customFetch: (request: string, init: RequestInit) => Promise<Response> = (...args) => fetch(...args) as any, middlewares?: Middleware[], authenticationProvider?: BaseBearerTokenAuthenticationProvider): HttpClient {
		const middleware = middlewares || MiddlewareFactory.getDefaultMiddlewares(customFetch);
		if (authenticationProvider) {
			middleware.unshift(new AuthorizationHandler(authenticationProvider));
		}
		return new HttpClient(customFetch, ...middleware);
	}
}
