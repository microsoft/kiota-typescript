/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module ChaosHandler
 */

import type { HttpMethod, RequestOption } from "@microsoft/kiota-abstractions";
import { type Span, trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { FetchHeaders, FetchRequestInit } from "../utils/fetchDefinitions";
import type { Middleware } from "./middleware";
import { httpStatusCode, methodStatusCode } from "./options/ChaosHandlerData";
import type { ChaosHandlerOptions } from "./options/chaosHandlerOptions";
import { ChaosStrategy } from "./options/chaosStrategy";

/**
 *
 * Class
 * Middleware
 * Class representing RedirectHandler
 */
export class ChaosHandler implements Middleware {
	/**
	 * A member holding options to customize the handler behavior
	 */
	options: ChaosHandlerOptions = {
		chaosStrategy: ChaosStrategy.RANDOM,
		statusMessage: "A random status message",
		chaosPercentage: 10,
	};

	/**
	 * container for the manual map that has been written by the client
	 */
	private readonly manualMap: Map<string, Map<string, number>>;

	/** @inheritdoc */
	next: Middleware | undefined;

	/**
	 *
	 * To create an instance of ChaosHandler
	 * @param [options] - The chaos handler options instance
	 * @param manualMap - The Map passed by user containing url-statusCode info
	 */
	public constructor(options?: Partial<ChaosHandlerOptions>, manualMap?: Map<string, Map<string, number>>) {
		const chaosOptions = Object.assign(this.options, options);

		if (chaosOptions.chaosPercentage > 100 || chaosOptions.chaosPercentage < 0) {
			throw new Error("Chaos Percentage must be set to a value between 0 and 100.");
		}

		this.options = chaosOptions;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.manualMap = manualMap ?? new Map();
	}

	/**
	 * Fetches a random status code for the RANDOM mode from the predefined array
	 * @param requestMethod - the API method for the request
	 * @returns a random status code from a given set of status codes
	 */
	private generateRandomStatusCode(requestMethod: HttpMethod): number {
		const statusCodeArray: number[] = methodStatusCode[requestMethod];
		return statusCodeArray[Math.floor(Math.random() * statusCodeArray.length)];
	}

	/**
	 * Strips out the host url and returns the relative url only
	 * @param chaosHandlerOptions - The ChaosHandlerOptions object
	 * @param urlMethod - the complete URL
	 * @returns the string as relative URL
	 */
	private getRelativeURL(chaosHandlerOptions: ChaosHandlerOptions, urlMethod: string): string {
		const baseUrl = chaosHandlerOptions.baseUrl;
		if (baseUrl === undefined) {
			return urlMethod;
		}

		return urlMethod.replace(baseUrl, "").trim();
	}

	/**
	 * Gets a status code from the options or a randomly generated status code
	 * @param chaosHandlerOptions - The ChaosHandlerOptions object
	 * @param requestURL - the URL for the request
	 * @param requestMethod - the API method for the request
	 * @returns generated statusCode
	 */
	private getStatusCode(chaosHandlerOptions: ChaosHandlerOptions, requestURL: string, requestMethod: HttpMethod): number {
		if (chaosHandlerOptions.chaosStrategy === ChaosStrategy.MANUAL) {
			if (chaosHandlerOptions.statusCode !== undefined) {
				return chaosHandlerOptions.statusCode;
			} else {
				// manual mode with no status code, can be a global level or request level without statusCode
				const relativeURL: string = this.getRelativeURL(chaosHandlerOptions, requestURL);
				const definedResponses = this.manualMap.get(relativeURL);

				if (definedResponses !== undefined) {
					// checking Manual Map for exact match
					const mapCode = definedResponses.get(requestMethod);
					if (mapCode !== undefined) {
						return mapCode;
					}
					// else statusCode would be undefined
				} else {
					// checking for regex match if exact match doesn't work
					this.manualMap.forEach((value: Map<string, number>, key: string) => {
						const regexURL = new RegExp(key + "$");
						if (regexURL.test(relativeURL)) {
							const responseCode = this.manualMap.get(key)?.get(requestMethod);
							if (responseCode !== undefined) {
								return responseCode;
							}
						}
					});
				}
			}
		}

		// for manual mode status or if the url was not mapped to a code return a random status
		return this.generateRandomStatusCode(requestMethod);
	}

	/**
	 * Generates a respondy for the chaoe response
	 * @param chaosHandlerOptions - The ChaosHandlerOptions object
	 * @param statusCode - the status code for the response
	 * @returns the response body
	 */
	private createResponseBody(chaosHandlerOptions: ChaosHandlerOptions, statusCode: number) {
		if (chaosHandlerOptions.responseBody) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return chaosHandlerOptions.responseBody;
		}
		let body: any;
		if (statusCode >= 400) {
			const codeMessage: string = httpStatusCode[statusCode];
			const errMessage: string = chaosHandlerOptions.statusMessage;

			body = {
				error: {
					code: codeMessage,
					message: errMessage,
				},
			};
		} else {
			body = {};
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return body;
	}

	/**
	 * Composes a new chaotic response code with the configured parameters
	 * @param url The url of the request
	 * @param fetchRequestInit The fetch request init object
	 * @returns a response object with the configured parameters
	 */
	private createChaosResponse(url: string, fetchRequestInit: FetchRequestInit): any {
		if (fetchRequestInit.method === undefined) {
			throw new Error("Request method must be defined.");
		}

		const requestMethod = fetchRequestInit.method as HttpMethod;
		const statusCode = this.getStatusCode(this.options, url, requestMethod);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const responseBody = this.createResponseBody(this.options, statusCode);
		const stringBody = typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody);

		return {
			url,
			body: stringBody,
			status: statusCode,
			statusText: this.options.statusMessage,
			headers: this.options.headers ?? ({} as FetchHeaders),
		};
	}

	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("chaosHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.chaos.enable", true);
					return this.runChaos(url, requestInit, requestOptions);
				} finally {
					span.end();
				}
			});
		}
		return this.runChaos(url, requestInit, requestOptions);
	}
	public static readonly chaosHandlerTriggeredEventKey = "com.microsoft.kiota.chaos_handler_triggered";
	private runChaos(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>, span?: Span): Promise<Response> {
		if (Math.floor(Math.random() * 100) < this.options.chaosPercentage) {
			span?.addEvent(ChaosHandler.chaosHandlerTriggeredEventKey);
			return Promise.resolve(this.createChaosResponse(url, requestInit as FetchRequestInit));
		} else {
			if (!this.next) {
				throw new Error("Please set the next middleware to continue the request");
			}
			return this.next.execute(url, requestInit, requestOptions);
		}
	}
}
