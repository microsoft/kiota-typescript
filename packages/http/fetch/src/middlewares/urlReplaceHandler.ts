import type { RequestOption } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { Middleware } from "./middleware";
import { UrlReplaceHandlerOptions, UrlReplaceHandlerOptionsKey } from "./options/urlReplaceHandlerOptions";

/**
 * Replaces url placeholders with values from the request option.
 */
export class UrlReplaceHandler implements Middleware {
	/**
	 * @public
	 * @constructor
	 * Creates a new instance of the UrlReplaceHandler class
	 * @param {UrlReplaceHandlerOptions} handlerOptions The options for the url replace handler.
	 * @returns An instance of the UrlReplaceHandler class
	 */
	public constructor(private readonly handlerOptions: UrlReplaceHandlerOptions = new UrlReplaceHandlerOptions()) {
		if (!handlerOptions) {
			throw new Error("handlerOptions cannot be undefined");
		}
	}
	next: Middleware | undefined;
	/**
	 * @inheritdoc
	 */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption> | undefined): Promise<Response> {
		let currentOptions = this.handlerOptions;
		if (requestOptions && requestOptions[UrlReplaceHandlerOptionsKey]) {
			currentOptions = requestOptions[UrlReplaceHandlerOptionsKey] as UrlReplaceHandlerOptions;
		}
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("urlReplaceHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.urlReplace.enable", currentOptions.enabled);
					return this.replaceTokensInUrl(currentOptions, url, requestInit, requestOptions);
				} finally {
					span.end();
				}
			});
		}
		return this.replaceTokensInUrl(currentOptions, url, requestInit, requestOptions);
	}
	private replaceTokensInUrl(options: UrlReplaceHandlerOptions, url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption> | undefined): Promise<Response> {
		if (options.enabled) {
			Object.keys(options.urlReplacements).forEach((replacementKey) => {
				url = url.replace(replacementKey, options.urlReplacements[replacementKey]);
			});
		}
		const response = this.next?.execute(url, requestInit, requestOptions);
		if (!response) {
			throw new Error("Response is undefined");
		}
		return response;
	}
}
