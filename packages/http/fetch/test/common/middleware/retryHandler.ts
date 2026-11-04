/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { HttpMethod } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";
import { assert, describe, it, vi } from "vitest";

import { ObservabilityOptionKey, ObservabilityOptionsImpl } from "../../../src";

import { RetryHandlerOptionKey, RetryHandlerOptions, type ShouldRetry } from "../../../src/middlewares/options/retryHandlerOptions";
import { RetryHandler } from "../../../src/middlewares/retryHandler";
import type { FetchRequestInit } from "../../../src/utils/fetchDefinitions";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";

// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}
describe("RetryHandler.ts", () => {
	const retryHandler = new RetryHandler();
	const retryHandlerOptions = new RetryHandlerOptions();
	const tooManyRequestsResponseWithRetryAfterDelay = new Response("", {
		status: 429,
		statusText: "TooManyRequests",
		headers: {
			"Retry-After": "10",
		},
	});
	const tooManyRequestsResponseWithRetyAfterDate = new Response("", {
		status: 429,
		statusText: "TooManyRequests",
		headers: {
			"Retry-After": new Date(Date.now() + 10000).toUTCString(),
		},
	});
	const serviceUnavailableResponse = new Response("", {
		status: 503,
		statusText: "ServiceUnavailable",
	});
	const gatewayTimeoutResponse = new Response("", {
		status: 504,
		statusText: "GatewayTimeout",
	});
	const nonRetryResponse = new Response("", {
		status: 200,
		statusText: "OK",
	});

	describe("constructor", () => {
		it("Should set the option member with retryHanderOptions", () => {
			const handler = new RetryHandler(retryHandlerOptions);
			assert.isDefined(handler["options"]);
		});

		it("Should create retryHandler instance with default retryHandlerOptions", () => {
			const handler = new RetryHandler();
			assert.isDefined(handler["options"]);
		});
	});

	describe("isRetry", () => {
		it("Should return true for 429 response", () => {
			assert.isTrue(retryHandler["isRetry"](tooManyRequestsResponseWithRetryAfterDelay));
		});

		it("Should return true for 503 response", () => {
			assert.isTrue(retryHandler["isRetry"](serviceUnavailableResponse));
		});

		it("Should return true for 504 response", () => {
			assert.isTrue(retryHandler["isRetry"](gatewayTimeoutResponse));
		});

		it("Should return false for non retry response", () => {
			assert.isFalse(retryHandler["isRetry"](nonRetryResponse));
		});
	});

	describe("isBuffered", () => {
		it("Should succeed for non post, patch, put requests", () => {
			const options: FetchRequestInit = {
				method: "GET",
			};
			assert.isTrue(retryHandler["isBuffered"](options));
		});

		it("Should succeed for post request with non stream request", () => {
			const options: FetchRequestInit = {
				method: "POST",
				body: "test",
			};
			assert.isTrue(retryHandler["isBuffered"](options));
		});

		it("Should fail for stream request", () => {
			const options: FetchRequestInit = {
				method: "PUT",
				headers: {
					"content-type": "application/octet-stream",
				},
			};
			assert.isFalse(retryHandler["isBuffered"](options));
		});
	});

	describe("getDelay", () => {
		it("Should return retry delay from the response header", () => {
			const delay = retryHandler["getDelay"](tooManyRequestsResponseWithRetryAfterDelay, 1, 5);
			assert.equal(delay, 10);
		});

		it("Should return retry delay from the response header mentioning delay time", () => {
			const delay = retryHandler["getDelay"](tooManyRequestsResponseWithRetyAfterDate, 1, 5);
			assert.isDefined(delay);
		});

		it("Should return delay without exponential backoff", () => {
			const delay = retryHandler["getDelay"](gatewayTimeoutResponse, 1, 10);
			assert.isAbove(delay, 10);
			assert.isBelow(delay, 11);
		});

		it("Should return delay with exponential backoff", () => {
			const delay = retryHandler["getDelay"](gatewayTimeoutResponse, 2, 10);
			assert.isAbove(delay, 12);
			assert.isBelow(delay, 13);
		});

		it("Should return max delay for if the calculated delay is more", () => {
			const delay = retryHandler["getDelay"](gatewayTimeoutResponse, 10, 100);
			assert.isAbove(delay, 180);
			assert.isBelow(delay, 181);
		});
	});

	describe("getExponentialBackOffTime", () => {
		it("Should return 0 delay for 0th attempt i.e for a fresh request", () => {
			const time = retryHandler["getExponentialBackOffTime"](0);
			assert.equal(time, 0);
		});

		it("Should return attempt time", () => {
			const time = retryHandler["getExponentialBackOffTime"](1);
			assert.equal(time, 1);
		});
	});

	describe("sleep", async () => {
		it("Should run the sleep method for 1 second", async () => {
			await retryHandler["sleep"](1);
		});
	});

	const options = new RetryHandlerOptions();
	const handler = new RetryHandler(options);
	const dummyFetchHandler = new DummyFetchHandler();

	describe("set RedirectOptions in RequestInformation", () => {
		it("Should set the RedirectOptions from the context object", async () => {
			const delay = 1;
			const maxRetries = 2;
			const shouldRetry: ShouldRetry = () => false;
			const options = new RetryHandlerOptions({ delay, maxRetries, shouldRetry });

			const requestUrl = "url";
			const fetchRequestInit = {
				method: "PUT",
				headers: {
					"content-type": "application/octet-stream",
				},
			};
			const requestInformationOptions = {
				[RetryHandlerOptionKey]: options,
			};

			dummyFetchHandler.setResponses([new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
			const response = await handler["execute"](requestUrl, fetchRequestInit, requestInformationOptions);
			assert.equal(response.status, 429);
		});

		it("Should use the default set of options", async () => {
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "PUT",
				headers: {
					"content-type": "application/octet-stream",
				},
			};

			dummyFetchHandler.setResponses([new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
			const response = await handler["execute"](requestUrl, fetchRequestInit);
			assert.equal(response.status, 429);
		});
	});

	describe("executeWithRetry", async () => {
		it.each([
			["application/octet-stream", 429, 1],
			["application/json", 200, 2],
		] as const)("Should handle QUERY retries for %s", async (contentType, expectedStatus, expectedAttempts) => {
			const handler = new RetryHandler();
			const next = new DummyFetchHandler([new Response(null, { status: 429, headers: { "Retry-After": "0" } }), new Response("ok", { status: 200 })]);
			handler.next = next;
			const response = await handler.execute("/query", {
				method: HttpMethod.QUERY,
				headers: { "content-type": contentType },
				body: "test",
			});
			assert.equal(response.status, expectedStatus);
			assert.lengthOf(next.requests, expectedAttempts);
			assert.equal(next.requests[0].body, "test");
		});

		handler.next = dummyFetchHandler;
		const requestUrl = "url";
		const fetchRequestInit = {
			method: "GET",
		};
		const opts = new RetryHandlerOptions();

		it("Should return non retried response incase of maxRetries busted out", async () => {
			dummyFetchHandler.setResponses([new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
			const response = await handler["executeWithRetry"](requestUrl, fetchRequestInit, RetryHandlerOptions["MAX_MAX_RETRIES"], opts);
			assert.equal(response.status, 429);
		});

		it("Should return succeeded response for non retry response", async () => {
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })]);
			const response = await handler["executeWithRetry"](requestUrl, fetchRequestInit, 0, opts);
			assert.equal(response.status, 200);
		});

		it("Should return non retried response for streaming request", async () => {
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "POST",
				headers: {
					"content-type": "application/octet-stream",
				},
			};

			dummyFetchHandler.setResponses([new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
			const response = await handler["executeWithRetry"](requestUrl, fetchRequestInit, 0, opts);
			assert.equal(response.status, 429);
		});

		it(
			"Should successfully retry and return ok response",
			async () => {
				const opts = new RetryHandlerOptions({ delay: 1 });
				const handler = new RetryHandler(opts);
				handler.next = dummyFetchHandler;
				dummyFetchHandler.setResponses([new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
				const response = await handler["executeWithRetry"](requestUrl, fetchRequestInit, 0, opts);
				assert.equal(response.status, 200);
			},
			20 * 1000,
		);

		it(
			"Should fail by exceeding max retries",
			async () => {
				const opts = new RetryHandlerOptions({ delay: 1, maxRetries: 2 });
				const handler = new RetryHandler(opts);
				handler.next = dummyFetchHandler;
				dummyFetchHandler.setResponses([new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response(null, { status: 429 }), new Response("ok", { status: 200 })]);
				const response = await handler["executeWithRetry"](requestUrl, fetchRequestInit, 0, opts);
				assert.equal(response.status, 429);
			},
			20 * 1000,
		);
	});
	describe("Observability", () => {
		it("maintains active span lifecycle until async retry completes and records exception on failure", async () => {
			let spanEnded = false;
			let recordedException: unknown;
			const spanAttributes: Record<string, unknown> = {};

			const testSpan = {
				setAttribute: (key: string, value: unknown) => {
					spanAttributes[key] = value;
				},
				recordException: (err: unknown) => {
					recordedException = err;
				},
				end: () => {
					spanEnded = true;
				},
			};

			const tracer = {
				startActiveSpan: (_name: string, callback: (span: typeof testSpan) => Promise<Response>) => {
					return callback(testSpan);
				},
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as any);

			let releaseDownstream: (() => void) | undefined;
			const downstreamBlocked = new Promise<void>((resolve) => {
				releaseDownstream = resolve;
			});

			const handler = new RetryHandler();
			const dummyNext = new DummyFetchHandler();
			dummyNext.execute = async () => {
				await downstreamBlocked;
				assert.isFalse(spanEnded);
				throw new Error("retry network error");
			};
			handler.next = dummyNext;

			try {
				const execution = handler.execute("https://example.com", {}, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				await vi.waitFor(() => assert.isDefined(releaseDownstream));
				assert.isFalse(spanEnded);
				releaseDownstream?.();
				await execution;
				assert.fail("should have thrown");
			} catch (err: any) {
				assert.equal(err.message, "retry network error");
				assert.isTrue(spanEnded);
				assert.isDefined(recordedException);
				assert.isTrue(spanAttributes["com.microsoft.kiota.handler.retry.enable"]);
			} finally {
				getTracerSpy.mockRestore();
			}
		});

		it("creates retry attempt spans with propagated tracerName across multiple retry attempts", async () => {
			const spanNames: string[] = [];
			const resendCounts: number[] = [];
			const tracer = {
				startActiveSpan: (name: string, callback: (span: any) => Promise<Response>) => {
					spanNames.push(name);
					return callback({
						setAttribute: (k: string, v: unknown) => {
							if (k === "http.request.resend_count") {
								resendCounts.push(v as number);
							}
						},
						recordException: () => {},
						end: () => {},
					});
				},
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as any);

			const handler = new RetryHandler(new RetryHandlerOptions({ delay: 0, maxRetries: 3 }));
			(handler as any).sleep = () => Promise.resolve();
			let callCount = 0;
			const dummyNext = new DummyFetchHandler();
			dummyNext.execute = async () => {
				callCount++;
				if (callCount <= 2) {
					return new Response("", { status: 503 });
				}
				return new Response("OK", { status: 200 });
			};
			handler.next = dummyNext;

			try {
				const response = await handler.execute("https://example.com/retry", {}, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.equal(response.status, 200);
				assert.deepEqual(spanNames, [
					"retryHandler - execute",
					"retryHandler - attempt 1",
					"retryHandler - attempt 2",
				]);
				assert.deepEqual(resendCounts, [1, 2]);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});