import { Middleware, MiddlewareFactory } from ".";
import { HttpClient } from "./httpClient";

/**
 * @class
 * Class containing function(s) related to the middleware pipelines.
 */
export class KiotaClientFactory {
	/**
	 * @public
	 * @static
	 * Returns an instance of HttpClient with the provided middlewares and custom fetch implementation both parameters are optional. 
	 * if not provided, the default fetch implementation and middlewares will be used.
	 * @param {(request: string, init?: RequestInit) => Promise < Response >} customFetch - a Fetch API implementation
	 * @param {Middleware[]} middlewares - an aray of Middleware handlers
	 * If middlewares param is undefined, the httpClient instance will use the default array of middlewares.
	 * Set middlewares to `null` if you do not wish to use middlewares.
	 * If custom fetch is undefined, the httpClient instance uses the `DefaultFetchHandler`
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
	public static create(customFetch: (request: string, init: RequestInit) => Promise<Response> = (...args) => fetch(...args) as any, middlewares?: Middleware[]): HttpClient {
		const middleware = middlewares || MiddlewareFactory.getDefaultMiddlewares(customFetch);
		return new HttpClient(customFetch, ...middleware);
	}
}
