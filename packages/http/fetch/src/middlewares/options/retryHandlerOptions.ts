/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module RetryHandlerOptions
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";

import type { FetchResponse } from "../../utils/fetchDefinitions";

/**
 *
 * A type declaration for shouldRetry callback
 */
export type ShouldRetry = (delay: number, attempt: number, request: string, options: RequestInit | undefined, response: FetchResponse) => boolean;

export const RetryHandlerOptionKey = "RetryHandlerOptionKey";
/**
 * Signature to define the RetryHandlerOptions constructor parameters
 */
export interface RetryHandlerOptionsParams {
	/**
	 * The delay value in seconds
	 * @default 3
	 */
	delay?: number;
	/**
	 * The maxRetries value
	 * @default 3
	 */
	maxRetries?: number;
	/**
	 * The shouldRetry callback function
	 */
	shouldRetry?: ShouldRetry;
	/**
	 * Whether POST and PATCH requests are retried only after a response showing the server didn't process them.
	 * POST and PATCH aren't idempotent, so resending one the server already processed can repeat its side effect, such as sending an email twice.
	 * A 504 can arrive after the server processed the request.
	 * When this is true, POST and PATCH requests are retried only after a 429 or 503 response, and a 504 is returned to the caller.
	 * This relies on the common service convention, followed by Microsoft Graph, that a 429 or 503 response means the server didn't process the request.
	 * HTTP doesn't guarantee this, so a service that returns 429 or 503 after acting on a request can still see it repeated.
	 * PUT and DELETE also change state, but they're idempotent, so they aren't affected, and neither are other methods.
	 * @default false
	 */
	retryUnprocessedMutationsOnly?: boolean;
}

/**
 * RequestOption
 * Options
 * Class for RetryHandlerOptions
 */

export class RetryHandlerOptions implements RequestOption {
	/**
	 * A member holding default delay value in seconds
	 */
	private static readonly DEFAULT_DELAY = 3;

	/**
	 * A member holding default maxRetries value
	 */
	private static readonly DEFAULT_MAX_RETRIES = 3;

	/**
	 * A member holding maximum delay value in seconds
	 */
	private static readonly MAX_DELAY = 180;

	/**
	 * A member holding maximum maxRetries value
	 */
	private static readonly MAX_MAX_RETRIES = 10;

	/**
	 * A member holding default shouldRetry callback
	 * @returns true
	 */
	private static readonly defaultShouldRetry: ShouldRetry = () => true;

	/*
	 * @public
	 * A member holding delay value in seconds
	 */
	public delay: number;

	/**
	 *
	 * A member holding maxRetries value
	 */
	public maxRetries: number;

	/**
	 *
	 * A member holding shouldRetry callback
	 */
	public shouldRetry: ShouldRetry;

	/**
	 * Whether POST and PATCH requests are retried only after a response showing the server didn't process them.
	 * POST and PATCH aren't idempotent, so resending one the server already processed can repeat its side effect, such as sending an email twice.
	 * A 504 can arrive after the server processed the request.
	 * When this is true, POST and PATCH requests are retried only after a 429 or 503 response, and a 504 is returned to the caller.
	 * This relies on the common service convention, followed by Microsoft Graph, that a 429 or 503 response means the server didn't process the request.
	 * HTTP doesn't guarantee this, so a service that returns 429 or 503 after acting on a request can still see it repeated.
	 * PUT and DELETE also change state, but they're idempotent, so they aren't affected, and neither are other methods.
	 */
	public retryUnprocessedMutationsOnly: boolean;

	/**
	 *
	 * To create an instance of RetryHandlerOptions
	 * @param options - The RetryHandlerOptionsParams object
	 * @returns An instance of RetryHandlerOptions
	 * @example	const options = new RetryHandlerOptions({ maxRetries: 4 });
	 */
	public constructor(options: Partial<RetryHandlerOptionsParams> = {}) {
		if (options.delay !== undefined && options.delay > RetryHandlerOptions.MAX_DELAY) {
			throw this.createError(`Delay should not be more than ${RetryHandlerOptions.MAX_DELAY}`, "MaxLimitExceeded");
		}
		if (options.maxRetries !== undefined && options.maxRetries > RetryHandlerOptions.MAX_MAX_RETRIES) {
			throw this.createError(`MaxRetries should not be more than ${RetryHandlerOptions.MAX_MAX_RETRIES}`, "MaxLimitExceeded");
		}
		if (options.delay !== undefined && options.delay < 0) {
			throw this.createError(`Delay should not be negative`, "MinExpectationNotMet");
		}
		if (options.maxRetries !== undefined && options.maxRetries < 0) {
			throw this.createError(`MaxRetries should not be negative`, "MinExpectationNotMet");
		}
		this.delay = Math.min(options.delay ?? RetryHandlerOptions.DEFAULT_DELAY, RetryHandlerOptions.MAX_DELAY);
		this.maxRetries = Math.min(options.maxRetries ?? RetryHandlerOptions.DEFAULT_MAX_RETRIES, RetryHandlerOptions.MAX_MAX_RETRIES);
		this.shouldRetry = options.shouldRetry ?? RetryHandlerOptions.defaultShouldRetry;
		this.retryUnprocessedMutationsOnly = options.retryUnprocessedMutationsOnly ?? false;
	}

	/**
	 *
	 * Creates an error object with a message and name
	 * @param message - The error message
	 * @param name - The error name
	 * @returns An error object
	 */
	private createError(message: string, name: string): Error {
		const error = new Error(message);
		error.name = name;
		return error;
	}

	/**
	 *
	 * To get the maximum delay
	 * @returns A maximum delay
	 */
	public getMaxDelay(): number {
		return RetryHandlerOptions.MAX_DELAY;
	}

	public getKey(): string {
		return RetryHandlerOptionKey;
	}
}
