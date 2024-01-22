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
 * @type
 * A type declaration for shouldRetry callback
 */
export type ShouldRetry = (delay: number, attempt: number, request: string, options: RequestInit | undefined, response: FetchResponse) => boolean;

export const RetryHandlerOptionKey = "RetryHandlerOptionKey";
/**
 * @interface
 * Signature to define the RetryHandlerOptions constructor parameters
 */
export interface RetryHandlerOptionsParams {
	/**
	 * @member
	 * The delay value in seconds
	 */
	delay?: number;
	/**
	 * @member
	 * The maxRetries value
	 */
	maxRetries?: number;
	/**
	 * @member
	 * The shouldRetry callback function
	 */
	shouldRetry?: ShouldRetry;
}

/**
 * @class
 * @implements RequestOption
 * Options
 * Class for RetryHandlerOptions
 */

export class RetryHandlerOptions implements RequestOption {
	/**
	 * @private
	 * @static
	 * A member holding default delay value in seconds
	 */
	private static DEFAULT_DELAY = 3;

	/**
	 * @private
	 * @static
	 * A member holding default maxRetries value
	 */
	private static DEFAULT_MAX_RETRIES = 3;

	/**
	 * @private
	 * @static
	 * A member holding maximum delay value in seconds
	 */
	private static MAX_DELAY = 180;

	/**
	 * @private
	 * @static
	 * A member holding maximum maxRetries value
	 */
	private static MAX_MAX_RETRIES = 10;

	/**
	 * @private
	 * A member holding default shouldRetry callback
	 */
	private static defaultShouldRetry: ShouldRetry = () => true;

	/*
	 * @public
	 * A member holding delay value in seconds
	 */
	public delay: number;

	/**
	 * @public
	 * A member holding maxRetries value
	 */
	public maxRetries: number;

	/**
	 * @public
	 * A member holding shouldRetry callback
	 */
	public shouldRetry: ShouldRetry;

	/**
	 * @public
	 * @constructor
	 * To create an instance of RetryHandlerOptions
	 * @param {RetryHandlerOptionsParams} options - The RetryHandlerOptionsParams object
	 * @returns An instance of RetryHandlerOptions
	 */
	public constructor(options: RetryHandlerOptionsParams = {} as RetryHandlerOptionsParams) {
		if (options.delay && options.delay > RetryHandlerOptions.MAX_DELAY) {
			throw this.createError(`Delay should not be more than ${RetryHandlerOptions.MAX_DELAY}`, "MaxLimitExceeded");
		}
		if (options.maxRetries && options.maxRetries > RetryHandlerOptions.MAX_MAX_RETRIES) {
			throw this.createError(`MaxRetries should not be more than ${RetryHandlerOptions.MAX_MAX_RETRIES}`, "MaxLimitExceeded");
		}
		if (options.delay && options.delay < 0) {
			throw this.createError(`Delay should not be negative`, "MinExpectationNotMet");
		}
		if (options.maxRetries && options.maxRetries < 0) {
			throw this.createError(`MaxRetries should not be negative`, "MinExpectationNotMet");
		}
		this.delay = Math.min(options.delay ?? RetryHandlerOptions.DEFAULT_DELAY, RetryHandlerOptions.MAX_DELAY);
		this.maxRetries = Math.min(options.maxRetries ?? RetryHandlerOptions.DEFAULT_MAX_RETRIES, RetryHandlerOptions.MAX_MAX_RETRIES);
		this.shouldRetry = options.shouldRetry ?? RetryHandlerOptions.defaultShouldRetry;
	}

	/**
	 * @private
	 * Creates an error object with a message and name
	 * @param {string} message - The error message
	 * @param {string} name - The error name
	 * @returns An error object
	 */
	private createError(message: string, name: string): Error {
		const error = new Error(message);
		error.name = name;
		return error;
	}

	/**
	 * @public
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
