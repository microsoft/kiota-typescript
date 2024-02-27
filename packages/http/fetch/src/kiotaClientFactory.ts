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
	 * Returns an instance of HttpClient with the provided middlewares and custom fetch implementation
	 * @returns a HttpClient instance
	 */
	public static create(customFetch: (request: string, init: RequestInit) => Promise<Response> = fetch as any, middlewares?: Middleware[]): HttpClient {
		const middleware = middlewares || MiddlewareFactory.getDefaultMiddlewares(customFetch);
		return new HttpClient(customFetch, ...middleware);
	}
}
