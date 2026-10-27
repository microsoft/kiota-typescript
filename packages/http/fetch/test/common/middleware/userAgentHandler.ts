/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { trace } from "@opentelemetry/api";
import { assert, describe, it, vi } from "vitest";

import { UserAgentHandler, UserAgentHandlerOptions } from "../../../src";
import { ObservabilityOptionKey, ObservabilityOptionsImpl } from "../../../src/observabilityOptions";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";

// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}
describe("userAgentHandler.ts", function () {
	const dummyFetchHandler = new DummyFetchHandler();
	describe("adds the user agent product", async () => {
		it("Should adds the product", async () => {
			const options = new UserAgentHandlerOptions();
			const handler = new UserAgentHandler(options);
			handler.next = dummyFetchHandler;
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })]);
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "GET",
			};
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			assert.equal(((fetchRequestInit as any).headers["User-Agent"] as string).split("/")[0], "kiota-typescript");
		});
		it("Does not add the product twice", async () => {
			const options = new UserAgentHandlerOptions();
			const handler = new UserAgentHandler(options);
			handler.next = dummyFetchHandler;
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 }), new Response("ok", { status: 200 })]);
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "GET",
			};
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			assert.equal(((fetchRequestInit as any).headers["User-Agent"] as string).split("kiota-typescript").length, 2);
		});
		it("Does not add the product when disabled", async () => {
			const options = new UserAgentHandlerOptions({ enable: false });
			const handler = new UserAgentHandler(options);
			handler.next = dummyFetchHandler;
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })]);
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "GET",
			};
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			assert.isUndefined((fetchRequestInit as any).headers);
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
			const handler = new UserAgentHandler();
			handler.next = dummyFetch;

			try {
				const execution = handler.execute("https://example.com", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
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
					if (name === "com.microsoft.kiota.handler.useragent.enable") {
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
			dummyFetch.execute = async () => new Response("ok", { status: 200 });
			const handler = new UserAgentHandler(new UserAgentHandlerOptions({ enable: false }));
			handler.next = dummyFetch;

			try {
				await handler.execute("https://example.com", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.isFalse(enabledAttribute);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});
