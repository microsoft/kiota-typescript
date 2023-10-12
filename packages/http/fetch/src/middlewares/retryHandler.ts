/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module RetryHandler
 */

import { HttpMethod, type RequestOption } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";

import { getObservabilityOptionsFromRequest } from "../observabilityOptions";
import type { FetchRequestInit, FetchResponse } from "../utils/fetchDefinitions";
import { getRequestHeader, setRequestHeader } from "../utils/headersUtil";
import { type Middleware } from "./middleware";
import { RetryHandlerOptionKey, RetryHandlerOptions } from "./options/retryHandlerOptions";

/**
 * @class
 * @implements Middleware
 * Class for RetryHandler
 */
export class RetryHandler implements Middleware {
	/**
	 * @private
	 * @static
	 * A list of status codes that needs to be retried
	 */
	private static RETRY_STATUS_CODES: Set<number> = new Set([
		429, // Too many requests
		503, // Service unavailable
		504, // Gateway timeout
	]);

	/**
	 * @private
	 * @static
	 * A member holding the name of retry attempt header
	 */
	private static RETRY_ATTEMPT_HEADER = "Retry-Attempt";

	/**
	 * @private
	 * @static
	 * A member holding the name of retry after header
	 */
	private static RETRY_AFTER_HEADER = "Retry-After";

	/**
	 * @private
	 * The next middleware in the middleware chain
	 */
	next: Middleware | undefined;

	/**
	 * @public
	 * @constructor
	 * To create an instance of RetryHandler
	 * @param {RetryHandlerOptions} [options = new RetryHandlerOptions()] - The retry handler options value
	 * @returns An instance of RetryHandler
	 */
	public constructor(private options: RetryHandlerOptions = new RetryHandlerOptions()) {
		if (!options) {
			throw new Error("The options parameter is required.");
		}
	}

	/**
	 *
	 * @private
	 * To check whether the response has the retry status code
	 * @param {Response} response - The response object
	 * @returns Whether the response has retry status code or not
	 */
	private isRetry(response: FetchResponse): boolean {
		return RetryHandler.RETRY_STATUS_CODES.has(response.status);
	}

	/**
	 * @private
	 * To check whether the payload is buffered or not
	 * @param {RequestInit} options - The options of a request
	 * @returns Whether the payload is buffered or not
	 */
	private isBuffered(options: FetchRequestInit): boolean {
		const method = options.method;
		const isPutPatchOrPost: boolean = method === HttpMethod.PUT || method === HttpMethod.PATCH || method === HttpMethod.POST;
		if (isPutPatchOrPost) {
			const isStream = getRequestHeader(options, "content-type")?.toLowerCase() === "application/octet-stream";
			if (isStream) {
				return false;
			}
		}
		return true;
	}

	/**
	 * @private
	 * To get the delay for a retry
	 * @param {Response} response - The response object
	 * @param {number} retryAttempts - The current attempt count
	 * @param {number} delay - The delay value in seconds
	 * @returns A delay for a retry
	 */
	private getDelay(response: FetchResponse, retryAttempts: number, delay: number): number {
		const getRandomness = () => Number(Math.random().toFixed(3));
		const retryAfter = response.headers !== undefined ? response.headers.get(RetryHandler.RETRY_AFTER_HEADER) : null;
		let newDelay: number;
		if (retryAfter !== null) {
			// Retry-After: <http-date>
			if (Number.isNaN(Number(retryAfter))) {
				newDelay = Math.round((new Date(retryAfter).getTime() - Date.now()) / 1000);
			} else {
				// Retry-After: <delay-seconds>
				newDelay = Number(retryAfter);
			}
		} else {
			// Adding randomness to avoid retrying at a same
			newDelay = retryAttempts >= 2 ? this.getExponentialBackOffTime(retryAttempts) + delay + getRandomness() : delay + getRandomness();
		}
		return Math.min(newDelay, this.options.getMaxDelay() + getRandomness());
	}

	/**
	 * @private
	 * To get an exponential back off value
	 * @param {number} attempts - The current attempt count
	 * @returns An exponential back off value
	 */
	private getExponentialBackOffTime(attempts: number): number {
		return Math.round((1 / 2) * (2 ** attempts - 1));
	}

	/**
	 * @private
	 * @async
	 * To add delay for the execution
	 * @param {number} delaySeconds - The delay value in seconds
	 * @returns Nothing
	 */
	private async sleep(delaySeconds: number): Promise<void> {
		const delayMilliseconds = delaySeconds * 1000;
		return new Promise((resolve) => setTimeout(resolve, delayMilliseconds)); // browser or node
	}

	/**
	 * @private
	 * @async
	 * To execute the middleware with retries
	 * @param {Context} context - The context object
	 * @param {number} retryAttempts - The current attempt count
	 * @param {Record<string, RequestOption>} [requestOptions = {}] - The request options
	 * @param {RetryHandlerOptions} currentOptions - The retry middleware options instance
	 * @param {string} tracerName - The name to use for the tracer
	 * @returns A Promise that resolves to nothing
	 */
	private async executeWithRetry(url: string, fetchRequestInit: FetchRequestInit, retryAttempts: number, currentOptions: RetryHandlerOptions, requestOptions?: Record<string, RequestOption>, tracerName?: string): Promise<FetchResponse> {
		const response = await this.next?.execute(url, fetchRequestInit as RequestInit, requestOptions);
		if (!response) {
			throw new Error("Response is undefined");
		}
		if (retryAttempts < currentOptions.maxRetries && this.isRetry(response) && this.isBuffered(fetchRequestInit) && currentOptions.shouldRetry(currentOptions.delay, retryAttempts, url, fetchRequestInit as RequestInit, response)) {
			++retryAttempts;
			setRequestHeader(fetchRequestInit, RetryHandler.RETRY_ATTEMPT_HEADER, retryAttempts.toString());
			if (response) {
				const delay = this.getDelay(response, retryAttempts, currentOptions.delay);
				await this.sleep(delay);
			}
			if (tracerName) {
				return await trace.getTracer(tracerName).startActiveSpan(`retryHandler - attempt ${retryAttempts}`, (span) => {
					try {
						span.setAttribute("http.retry_count", retryAttempts);
						span.setAttribute("http.status_code", response.status);
						return this.executeWithRetry(url, fetchRequestInit, retryAttempts, currentOptions, requestOptions);
					} finally {
						span.end();
					}
				});
			}

			return await this.executeWithRetry(url, fetchRequestInit, retryAttempts, currentOptions, requestOptions);
		} else {
			return response;
		}
	}

	/**
	 * @public
	 * @async
	 * To execute the current middleware
	 * @param {Context} context - The context object of the request
	 * @returns A Promise that resolves to nothing
	 */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		const retryAttempts = 0;

		let currentOptions = this.options;
		if (requestOptions && requestOptions[RetryHandlerOptionKey]) {
			currentOptions = requestOptions[RetryHandlerOptionKey] as RetryHandlerOptions;
		}
		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			return trace.getTracer(obsOptions.getTracerInstrumentationName()).startActiveSpan("retryHandler - execute", (span) => {
				try {
					span.setAttribute("com.microsoft.kiota.handler.retry.enable", true);
					return this.executeWithRetry(url, requestInit as FetchRequestInit, retryAttempts, currentOptions, requestOptions, obsOptions.getTracerInstrumentationName());
				} finally {
					span.end();
				}
			});
		}
		return this.executeWithRetry(url, requestInit as FetchRequestInit, retryAttempts, currentOptions, requestOptions);
	}
}
