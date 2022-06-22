/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module ChaosHandler
 */

import { HttpMethod, RequestOption } from "@microsoft/kiota-abstractions";

import { FetchHeaders, FetchRequestInit, FetchResponse } from "../utils/fetchDefinitions";
import { Middleware } from "./middleware";
import { httpStatusCode, methodStatusCode } from "./options/ChaosHandlerData";
import { ChaosHandlerOptions } from "./options/chaosHandlerOptions";
import { ChaosStrategy } from "./options/chaosStrategy";

/**
 * @class
 * Class
 * @implements Middleware
 * Class representing RedirectHandler
 */
export class ChaosHandler implements Middleware {
	/**
	 * A member holding options to customize the handler behavior
	 *
	 * @private
	 */
	options: ChaosHandlerOptions = {
		chaosStrategy: ChaosStrategy.RANDOM,
		statusMessage: "A random status message",
		chaosPercentage: 10,
	};

	/**
	 * container for the manual map that has been written by the client
	 *
	 * @private
	 */
	private manualMap: Map<string, Map<string, number>>;

	/** @inheritdoc */
	next: Middleware | undefined;

	/**
	 * @public
	 * @constructor
	 * To create an instance of ChaosHandler
	 * @param {ChaosHandlerOptions} [options = new ChaosHandlerOptions()] - The chaos handler options instance
	 * @param manualMap - The Map passed by user containing url-statusCode info
	 */
	public constructor(options?: Partial<ChaosHandlerOptions>, manualMap?: Map<string, Map<string, number>>) {
		const chaosOptions = Object.assign(this.options, options);

		if (chaosOptions.chaosPercentage > 100 || chaosOptions.chaosPercentage < 0) {
			throw new Error("Chaos Percentage must be set to a value between 0 and 100.");
		}

		this.options = chaosOptions;
		this.manualMap = manualMap ?? new Map();
	}

	/**
	 * Fetches a random status code for the RANDOM mode from the predefined array
	 * @private
	 * @param {string} requestMethod - the API method for the request
	 * @returns a random status code from a given set of status codes
	 */
	private generateRandomStatusCode(requestMethod: HttpMethod): number {
		const statusCodeArray: number[] = methodStatusCode[requestMethod] as number[];
		return statusCodeArray[Math.floor(Math.random() * statusCodeArray.length)];
	}

	/**
	 * Strips out the host url and returns the relative url only
	 * @private
	 * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
	 * @param {string} urlMethod - the complete URL
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
	 * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
	 * @param {string} requestURL - the URL for the request
	 * @param {HttpMethod} requestMethod - the API method for the request
	 * @returns {number} generated statusCode
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
	 * @private
	 * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
	 * @param {string} requestID - request id
	 * @param {string} requestDate - date of the request
	 *  * @returns response body
	 */
	private createResponseBody(chaosHandlerOptions: ChaosHandlerOptions, statusCode: number) {
		if (chaosHandlerOptions.responseBody) {
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
		return body;
	}

	/**
	 * Composes a new chaotic response code with the configured parameters
	 * @param {string} url
	 * @param {FetchRequestInit} fetchRequestInit
	 * @returns {Response}
	 */
	private createChaosResponse(url: string, fetchRequestInit: FetchRequestInit): any {
		if (fetchRequestInit.method === undefined) {
			throw new Error("Request method must be defined.");
		}

		const requestMethod = fetchRequestInit.method as HttpMethod;
		const statusCode = this.getStatusCode(this.options, url, requestMethod);
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

	public async execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption> | undefined): Promise<Response> {
		if (Math.floor(Math.random() * 100) < this.options.chaosPercentage) {
			return Promise.resolve(this.createChaosResponse(url, requestInit as FetchRequestInit));
		} else {
			if (!this.next) {
				throw new Error("Please set the next middleware to continue the request");
			}
			return await this.next.execute(url, requestInit, requestOptions);
		}
	}
}
