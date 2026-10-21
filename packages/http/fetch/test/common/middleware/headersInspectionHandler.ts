/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it, vi } from "vitest";
import { trace } from "@opentelemetry/api";

import { HeadersInspectionHandler, HeadersInspectionOptions, ObservabilityOptionKey, ObservabilityOptionsImpl } from "../../../src";
import { DummyFetchHandler } from "./dummyFetchHandler";
const defaultOptions = new HeadersInspectionOptions();
describe("HeadersInspectionHandler.ts", () => {
	describe("constructor", () => {
		it("Should create an instance with given options", () => {
			const handler = new HeadersInspectionHandler(defaultOptions);
			assert.isDefined(handler["_options"]);
		});

		it("Should create an instance with default set of options", () => {
			const handler = new HeadersInspectionHandler();
			assert.isDefined(handler["_options"]);
		});
	});

	describe("gets request headers", () => {
		it("Should return request headers", async () => {
			const options = new HeadersInspectionOptions({ inspectRequestHeaders: true });
			const handler = new HeadersInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([
				new Response(undefined, {
					headers: {
						["test"]: "test",
					},
					status: 200,
				}),
			] as any);
			handler.next = dummyFetchHandler;
			await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["test", "test"]] });
			const headers = options.getRequestHeaders();
			assert.isDefined(headers);
			assert.isEmpty(options.getResponseHeaders());
			assert.equal(headers.tryGetValue("test")![0], "test");
		});

		it("Should return response headers", async () => {
			const options = new HeadersInspectionOptions({ inspectRequestHeaders: false, inspectResponseHeaders: true });
			const handler = new HeadersInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([
				new Response(undefined, {
					headers: {
						["test"]: "test",
					},
					status: 200,
				}),
			] as any);
			handler.next = dummyFetchHandler;
			await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["test", "test"]] });
			const headers = options.getResponseHeaders();
			assert.isDefined(headers);
			assert.isEmpty(options.getRequestHeaders());
			assert.equal(headers.tryGetValue("test")![0], "test");
		});

		it("Should clear headers between consecutive requests using the same options", async () => {
			const options = new HeadersInspectionOptions({ inspectRequestHeaders: true, inspectResponseHeaders: true });
			const handler = new HeadersInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([
				new Response(undefined, {
					headers: { ["resp1"]: "val1" },
					status: 200,
				}),
				new Response(undefined, {
					headers: { ["resp2"]: "val2" },
					status: 200,
				}),
			] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["req1", "val1"]] });
			assert.equal(options.getRequestHeaders().tryGetValue("req1")![0], "val1");
			assert.equal(options.getResponseHeaders().tryGetValue("resp1")![0], "val1");

			await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["req2", "val2"]] });
			assert.isNull(options.getRequestHeaders().tryGetValue("req1"));
			assert.equal(options.getRequestHeaders().tryGetValue("req2")![0], "val2");
			assert.isNull(options.getResponseHeaders().tryGetValue("resp1"));
			assert.equal(options.getResponseHeaders().tryGetValue("resp2")![0], "val2");
		});

		it("Should clear prior headers when options reuse transitions from enabled to disabled inspection", async () => {
			const options = new HeadersInspectionOptions({ inspectRequestHeaders: true, inspectResponseHeaders: true });
			const handler = new HeadersInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([
				new Response(undefined, {
					headers: { ["resp1"]: "val1" },
					status: 200,
				}),
				new Response(undefined, {
					headers: { ["resp2"]: "val2" },
					status: 200,
				}),
			] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["req1", "val1"]] });
			assert.equal(options.getRequestHeaders().tryGetValue("req1")![0], "val1");
			assert.equal(options.getResponseHeaders().tryGetValue("resp1")![0], "val1");

			options.inspectRequestHeaders = false;
			options.inspectResponseHeaders = false;

			await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["req2", "val2"]] });
			assert.isNull(options.getRequestHeaders().tryGetValue("req1"));
			assert.isNull(options.getRequestHeaders().tryGetValue("req2"));
			assert.isNull(options.getResponseHeaders().tryGetValue("resp1"));
			assert.isNull(options.getResponseHeaders().tryGetValue("resp2"));
		});

		it("Should clear prior response headers when downstream execution rejects", async () => {
			const options = new HeadersInspectionOptions({ inspectRequestHeaders: true, inspectResponseHeaders: true });
			const handler = new HeadersInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([
				new Response(undefined, {
					headers: { ["resp1"]: "val1" },
					status: 200,
				}),
			] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["req1", "val1"]] });
			assert.equal(options.getRequestHeaders().tryGetValue("req1")![0], "val1");
			assert.equal(options.getResponseHeaders().tryGetValue("resp1")![0], "val1");

			dummyFetchHandler.execute = async () => {
				throw new Error("downstream network error");
			};

			try {
				await handler.execute("https://graph.microsoft.com/v1.0/me", { headers: [["req2", "val2"]] });
				assert.fail("should have thrown downstream error");
			} catch (error: any) {
				assert.equal(error.message, "downstream network error");
			}

			assert.isNull(options.getRequestHeaders().tryGetValue("req1"));
			assert.equal(options.getRequestHeaders().tryGetValue("req2")![0], "val2");
			assert.isNull(options.getResponseHeaders().tryGetValue("resp1"));
		});
	});

	describe("observability", () => {
		it("Should trace with headersInspectionHandler span name, attribute and async lifecycle", async () => {
			let spanName = "";
			let spanEnded = false;
			let enabledAttribute: unknown;
			let releaseDownstream: (() => void) | undefined;
			const downstreamBlocked = new Promise<void>((resolve) => {
				releaseDownstream = resolve;
			});

			const testSpan = {
				setAttribute: (name: string, value: unknown) => {
					if (name === "com.microsoft.kiota.handler.headersInspection.enable") {
						enabledAttribute = value;
					}
				},
				end: () => {
					spanEnded = true;
				},
			};

			const tracer = {
				startActiveSpan: (name: string, callback: (span: typeof testSpan) => Promise<Response>) => {
					spanName = name;
					return callback(testSpan);
				},
			};

			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as unknown as ReturnType<typeof trace.getTracer>);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async () => {
				await downstreamBlocked;
				return new Response("ok", { headers: { test: "val" } });
			};

			const options = new HeadersInspectionOptions({ inspectResponseHeaders: true });
			const handler = new HeadersInspectionHandler(options);
			handler.next = dummyFetchHandler;

			try {
				const execution = handler.execute("https://example.com", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				await vi.waitFor(() => assert.isDefined(releaseDownstream));
				assert.isFalse(spanEnded);
				assert.equal(spanName, "headersInspectionHandler - execute");
				assert.isTrue(enabledAttribute);
				releaseDownstream?.();
				await execution;
				assert.isTrue(spanEnded);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});
