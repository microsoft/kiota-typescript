/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { trace } from "@opentelemetry/api";
import { assert, describe, it, vi } from "vitest";

import { ParametersNameDecodingHandlerOptions, ParametersNameDecodingHandlerOptionsKey } from "../../../src/middlewares/options/parametersNameDecodingOptions";
import { RetryHandlerOptionKey, RetryHandlerOptions } from "../../../src/middlewares/options/retryHandlerOptions";
import { ParametersNameDecodingHandler } from "../../../src/middlewares/parametersNameDecodingHandler";
import { ObservabilityOptionKey, ObservabilityOptionsImpl } from "../../../src/observabilityOptions";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";
import { TestCallBackMiddleware } from "./testCallBackMiddleware";

const ResponseCtor: typeof Response = typeof globalThis.Response === "function" ? globalThis.Response : (getResponse() as unknown as typeof Response);

describe("parametersNameDecodingHandler", function () {
	const handler = new ParametersNameDecodingHandler();

	const data = [
		{ input: "http://localhost?%24select=diplayName&api%2Dversion=2", expected: "http://localhost?$select=diplayName&api-version=2" },
		{ input: "http://localhost?%24select=diplayName&api%7Eversion=2", expected: "http://localhost?$select=diplayName&api~version=2" },
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=2", expected: "http://localhost?$select=diplayName&api.version=2" },
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=2", expected: "http://localhost?$select=diplayName&api.version=2" },
		{ input: "http://localhost:888?%24select=diplayName&api%2Dversion=2", expected: "http://localhost:888?$select=diplayName&api-version=2" },
		{ input: "http://localhost", expected: "http://localhost" },
		{ input: "https://google.com/?q=1%2B2", expected: "https://google.com/?q=1%2B2" }, //Values are not decoded
		{ input: "https://google.com/?q=M%26A", expected: "https://google.com/?q=M%26A" }, //Values are not decoded
		{ input: "https://google.com/?q%2D1=M%26A", expected: "https://google.com/?q-1=M%26A" }, //Values are not decoded but params are
		{ input: "https://google.com/?q%2D1&q=M%26A=M%26A", expected: "https://google.com/?q-1&q=M%26A=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost:888?%24select=diplayName&api%2Dversion=1%2B2", expected: "http://localhost:888?$select=diplayName&api-version=1%2B2" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%2Dversion=M%26A", expected: "http://localhost?$select=diplayName&api-version=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%7Eversion=M%26A", expected: "http://localhost?$select=diplayName&api~version=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=M%26A", expected: "http://localhost?$select=diplayName&api.version=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=M%26A", expected: "http://localhost?$select=diplayName&api.version=M%26A" }, //Values are not decoded but params are
	];
	data.forEach((entry) => {
		it(`Should decode the parameters names ${entry.expected}`, async () => {
			let wasCalled = false;
			const fetchRequestInit = {
				method: "GET",
			};
			const requestInformationOptions = {};
			handler.next = new TestCallBackMiddleware((url: string) => {
				assert.equal(url, entry.expected);
				wasCalled = true;
			});
			await handler["execute"](entry.input, fetchRequestInit, requestInformationOptions);
			assert.isTrue(wasCalled);
		});
	});

	describe("options", () => {
		it("getKey returns ParametersNameDecodingHandlerOptionKey and differs from RetryHandlerOptionKey", () => {
			const options = new ParametersNameDecodingHandlerOptions();
			assert.equal(options.getKey(), ParametersNameDecodingHandlerOptionsKey);
			assert.equal(ParametersNameDecodingHandlerOptionsKey, "ParametersNameDecodingHandlerOptionKey");
			assert.notEqual(ParametersNameDecodingHandlerOptionsKey, RetryHandlerOptionKey);
		});

		it("coexists with RetryHandlerOptions in request options without collision", () => {
			const requestOptions: Record<string, any> = {};
			const decodeOptions = new ParametersNameDecodingHandlerOptions({ enable: false });
			const retryOptions = new RetryHandlerOptions({ maxRetries: 5 });
			requestOptions[decodeOptions.getKey()] = decodeOptions;
			requestOptions[retryOptions.getKey()] = retryOptions;
			assert.equal(requestOptions[ParametersNameDecodingHandlerOptionsKey], decodeOptions);
			assert.equal(requestOptions[RetryHandlerOptionKey], retryOptions);
		});

		it("respects custom request options passed via ParametersNameDecodingHandlerOptionsKey", async () => {
			let passedUrl = "";
			const testHandler = new ParametersNameDecodingHandler();
			testHandler.next = new TestCallBackMiddleware((url: string) => {
				passedUrl = url;
			});
			await testHandler.execute(
				"http://localhost?%24select=displayName",
				{ method: "GET" },
				{
					[ParametersNameDecodingHandlerOptionsKey]: new ParametersNameDecodingHandlerOptions({ enable: false }),
				},
			);
			assert.equal(passedUrl, "http://localhost?%24select=displayName");
		});

		it("ignores actual RetryHandlerOptions passed under RetryHandlerOptionKey", async () => {
			let passedUrl = "";
			const testHandler = new ParametersNameDecodingHandler();
			testHandler.next = new TestCallBackMiddleware((url: string) => {
				passedUrl = url;
			});
			await testHandler.execute(
				"http://localhost?%24select=displayName",
				{ method: "GET" },
				{
					[RetryHandlerOptionKey]: new RetryHandlerOptions(),
				},
			);
			assert.equal(passedUrl, "http://localhost?$select=displayName");
		});
	});

	describe("observability", () => {
		it("encloses downstream execution and records exception on failure", async () => {
			let spanEnded = false;
			let recordedException: unknown;
			const testSpan = {
				setAttribute: () => {},
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
			const dummyFetch = new DummyFetchHandler();
			dummyFetch.execute = async () => {
				await downstreamBlocked;
				assert.isFalse(spanEnded);
				throw new Error("transport failed");
			};
			const testHandler = new ParametersNameDecodingHandler();
			testHandler.next = dummyFetch;

			try {
				const execution = testHandler.execute("https://example.com/?%24select=name", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				await vi.waitFor(() => assert.isDefined(releaseDownstream));
				assert.isFalse(spanEnded);
				releaseDownstream?.();
				await execution;
				assert.fail("should have thrown");
			} catch (err: any) {
				assert.equal(err.message, "transport failed");
				assert.isTrue(spanEnded);
				assert.isDefined(recordedException);
			} finally {
				getTracerSpy.mockRestore();
			}
		});

		it("sets enabled attribute based on options", async () => {
			let enabledAttribute: unknown;
			const testSpan = {
				setAttribute: (name: string, value: unknown) => {
					if (name === "com.microsoft.kiota.handler.parameters_name_decoding.enable") {
						enabledAttribute = value;
					}
				},
				recordException: () => {},
				end: () => {},
			};
			const tracer = {
				startActiveSpan: (_name: string, callback: (span: typeof testSpan) => Promise<Response>) => {
					return callback(testSpan);
				},
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as any);
			const dummyFetch = new DummyFetchHandler();
			dummyFetch.execute = async () => new ResponseCtor("ok", { status: 200 });
			const testHandler = new ParametersNameDecodingHandler(new ParametersNameDecodingHandlerOptions({ enable: false }));
			testHandler.next = dummyFetch;

			try {
				await testHandler.execute("https://example.com/?%24select=name", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.isFalse(enabledAttribute);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});
