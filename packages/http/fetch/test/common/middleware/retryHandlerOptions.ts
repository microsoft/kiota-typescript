/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { assert, describe, it } from "vitest";

import { RetryHandlerOptions, type ShouldRetry } from "../../../src/middlewares/options/retryHandlerOptions";

describe("RetryHandlerOptions.ts", () => {
	describe("Constructor", () => {
		it("Should use default values if not given", () => {
			const options = new RetryHandlerOptions();
			assert.equal(options["delay"], RetryHandlerOptions["DEFAULT_DELAY"]);
			assert.equal(options["maxRetries"], RetryHandlerOptions["DEFAULT_MAX_RETRIES"]);
			assert.equal(options["shouldRetry"], RetryHandlerOptions["defaultShouldRetry"]);
		});

		it("Should throw error for both delay and maxRetries are higher than the limit", () => {
			try {
				const options = new RetryHandlerOptions({ delay: 1000, maxRetries: 1000 });
				throw new Error("Test Failed - Something wrong with the delay and maxRetries max limit validation");
			} catch (error) {
				assert.equal((error as Error).name, "MaxLimitExceeded");
			}
		});

		it("Should throw error for delay is higher than the limit", () => {
			try {
				const options = new RetryHandlerOptions({ delay: 1000, maxRetries: 2 });
				throw new Error("Test Failed - Test Failed - Something wrong with the delay max limit validation");
			} catch (error) {
				assert.equal((error as Error).name, "MaxLimitExceeded");
			}
		});

		it("Should throw error for maxRetries is higher than the limit", () => {
			try {
				const options = new RetryHandlerOptions({ delay: 1, maxRetries: 2000 });
				throw new Error("Test Failed - Something wrong with the maxRetries max limit validation");
			} catch (error) {
				assert.equal((error as Error).name, "MaxLimitExceeded");
			}
		});

		it("Should throw error for both delay and maxRetries are negative", () => {
			try {
				const options = new RetryHandlerOptions({ delay: -1, maxRetries: -100 });
				throw new Error("Test Failed - Something wrong with the delay and maxRetries max limit validation");
			} catch (error) {
				assert.equal((error as Error).name, "MinExpectationNotMet");
			}
		});

		it("Should throw error for delay is negative", () => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const options = new RetryHandlerOptions({ delay: -5, maxRetries: 2 });
				throw new Error("Test Failed - Something wrong with the delay max limit validation");
			} catch (error) {
				assert.equal((error as Error).name, "MinExpectationNotMet");
			}
		});

		it("Should throw error for maxRetries is negative", () => {
			try {
				const options = new RetryHandlerOptions({ delay: 1, maxRetries: -10 });
				throw new Error("Test Failed - Something wrong with the maxRetries max limit validation");
			} catch (error) {
				assert.equal((error as Error).name, "MinExpectationNotMet");
			}
		});

		it("Should accept all the given values", () => {
			const delay = 1;
			const maxRetries = 3;
			const shouldRetry: ShouldRetry = (d, a, req, o, res) => {
				return false;
			};
			const options = new RetryHandlerOptions({ delay, maxRetries, shouldRetry });
			assert.equal(options.delay, delay);
			assert.equal(options.maxRetries, maxRetries);
			assert.equal(options.shouldRetry, shouldRetry);
		});
	});

	describe("getMaxDelay", () => {
		it("Should return the max delay value", () => {
			const options = new RetryHandlerOptions();
			assert.equal(options.getMaxDelay(), RetryHandlerOptions["MAX_DELAY"]);
		});
	});
});
