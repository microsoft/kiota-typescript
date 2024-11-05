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
 * Middleware
 * Class for RetryHandler
 */
export class RetryHandler implements Middleware {
	/**
	 * A list of status codes that needs to be retried
	 */
	private static readonly RETRY_STATUS_CODES = new Set<number>([
		429, // Too many requests
		503, // Service unavailable
		504, // Gateway timeout
	]);

	/**
	 * A member holding the name of retry attempt header
	 */
	private static readonly RETRY_ATTEMPT_HEADER = "Retry-Attempt";

	/**
	 * A member holding the name of retry after header
	 */
	private static readonly RETRY_AFTER_HEADER = "Retry-After";

	/**
	 *
	 * The next middleware in the middleware chain
	 */
	next: Middleware | undefined;

	/**
	 *
	 * To create an instance of RetryHandler
	 * @param [options] - The retry handler options value
	 * @returns An instance of RetryHandler
	 */
	public constructor(private readonly options: RetryHandlerOptions = new RetryHandlerOptions()) {
		if (!options) {
			throw new Error("The options parameter is required.");
		}
	}

	/**
	 *
	 *
	 * To check whether the response has the retry status code
	 * @param response - The response object
	 * @returns Whether the response has retry status code or not
	 */
	private isRetry(response: FetchResponse): boolean {
		return RetryHandler.RETRY_STATUS_CODES.has(response.status);
	}

	/**
	 *
	 * To check whether the payload is buffered or not
	 * @param options - The options of a request
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
	 *
	 * To get the delay for a retry
	 * @param response - The response object
	 * @param retryAttempts - The current attempt count
	 * @param delay - The delay value in seconds
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
	 *
	 * To get an exponential back off value
	 * @param attempts - The current attempt count
	 * @returns An exponential back off value
	 */
	private getExponentialBackOffTime(attempts: number): number {
		return Math.round((1 / 2) * (2 ** attempts - 1));
	}

	/**
	 * To add delay for the execution
	 * @param delaySeconds - The delay value in seconds
	 * @returns A Promise that resolves to nothing
	 */
	private async sleep(delaySeconds: number): Promise<void> {
		const delayMilliseconds = delaySeconds * 1000;
		return new Promise((resolve) => setTimeout(resolve, delayMilliseconds)); // browser or node
	}

	/**
	 * To execute the middleware with retries
	 * @param url - The request url
	 * @param fetchRequestInit - The request options
	 * @param retryAttempts - The current attempt count
	 * @param currentOptions - The current request options for the retry handler.
	 * @param requestOptions - The retry middleware options instance
	 * @param tracerName - The name to use for the tracer
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
			let delay = null;
			if (response) {
				delay = this.getDelay(response, retryAttempts, currentOptions.delay);
				await this.sleep(delay);
			}
			if (tracerName) {
				return await trace.getTracer(tracerName).startActiveSpan(`retryHandler - attempt ${retryAttempts}`, (span) => {
					try {
						span.setAttribute("http.request.resend_count", retryAttempts);
						if (delay) {
							span.setAttribute("http.request.resend_delay", delay);
						}
						span.setAttribute("http.response.status_code", response.status);
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
	 * To execute the current middleware
	 * @param url - The request url
	 * @param requestInit - The request options
	 * @param requestOptions - The request options
	 * @returns A Promise that resolves to nothing
	 */
	public execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		const retryAttempts = 0;

		let currentOptions = this.options;
		if (requestOptions?.[RetryHandlerOptionKey]) {
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
