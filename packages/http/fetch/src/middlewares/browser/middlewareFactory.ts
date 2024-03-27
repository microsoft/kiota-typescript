import { CustomFetchHandler } from "../customFetchHandler";
import { HeadersInspectionHandler } from "../headersInspectionHandler";
import { Middleware } from "../middleware";
import { ParametersNameDecodingHandler } from "../parametersNameDecodingHandler";
import { RetryHandler } from "../retryHandler";
import { UserAgentHandler } from "../userAgentHandler";

/**
 * @class
 * Class containing function(s) related to the middleware pipelines.
 */
export class MiddlewareFactory {
	/**
	 * @public
	 * @static
	 * Returns the default middleware chain an array with the  middleware handlers
	 * @returns an array of the middleware handlers of the default middleware chain
	 */
	public static getDefaultMiddlewares(customFetch: (request: string, init: RequestInit) => Promise<Response> = (...args) => fetch(...args) as any): Middleware[] {
		// Browsers handles redirection automatically and do not require the redirectionHandler
		return [
            new RetryHandler(),
            new ParametersNameDecodingHandler(),
            new UserAgentHandler(),
            new HeadersInspectionHandler(),
            new CustomFetchHandler(customFetch)
        ];
	}
}
