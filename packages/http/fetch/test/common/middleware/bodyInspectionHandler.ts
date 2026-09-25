/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { trace } from "@opentelemetry/api";
import { assert, describe, expect, it, vi } from "vitest";

import { BodyInspectionHandler, BodyInspectionOptions, BodyInspectionOptionsKey, ObservabilityOptionKey, ObservabilityOptionsImpl, RetryHandler, RetryHandlerOptions } from "../../../src";
import { DummyFetchHandler } from "./dummyFetchHandler";

const defaultOptions = new BodyInspectionOptions();

describe("BodyInspectionHandler.ts", () => {
	describe("constructor", () => {
		it("Should create an instance with given options", () => {
			const handler = new BodyInspectionHandler(defaultOptions);
			assert.isDefined(handler["_options"]);
		});

		it("Should create an instance with default set of options", () => {
			const handler = new BodyInspectionHandler();
			assert.isDefined(handler["_options"]);
		});
	});

	describe("request body inspection", () => {
		it("Should clear a previous request capture when inspection is disabled or the body is unsupported", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async () => new Response("ok");
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "POST", body: "first body" });
			assert.isDefined(options.requestBody);

			options.inspectRequestBody = false;
			await handler.execute("https://example.com", { method: "POST", body: "second body" });
			assert.isUndefined(options.requestBody);

			options.inspectRequestBody = true;
			await handler.execute("https://example.com", { method: "POST", body: "third body" });
			assert.isDefined(options.requestBody);

			await handler.execute("https://example.com", { method: "POST", body: new FormData() });
			assert.isUndefined(options.requestBody);
		});

		it("Should clear a previous request capture when the next request has no body", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok"), new Response("ok")] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "POST", body: "first body" });
			assert.isDefined(options.requestBody);

			await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.requestBody);
		});

		it("Should capture string request body and keep body intact for next middleware", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			let receivedBody: unknown;
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				receivedBody = requestInit.body;
				return new Response("ok", { status: 200 });
			};
			handler.next = dummyFetchHandler;

			const bodyText = JSON.stringify({ message: "hello world" });
			await handler.execute("https://example.com", { method: "POST", body: bodyText });

			const capturedBuffer = options.requestBody;
			assert.isDefined(capturedBuffer);
			const capturedText = new TextDecoder().decode(capturedBuffer);
			assert.equal(capturedText, bodyText);
			assert.equal(receivedBody, bodyText);
		});

		it("Should capture ArrayBuffer request body", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const sourceData = new Uint8Array([1, 2, 3, 4, 5]);
			await handler.execute("https://example.com", { method: "POST", body: sourceData.buffer });

			const captured = options.requestBody;
			assert.isDefined(captured);
			assert.deepEqual(Array.from(new Uint8Array(captured!)), [1, 2, 3, 4, 5]);
		});

		it("Should capture Uint8Array (ArrayBufferView) request body", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const sourceData = new Uint8Array([10, 20, 30]);
			await handler.execute("https://example.com", { method: "POST", body: sourceData });

			const captured = options.requestBody;
			assert.isDefined(captured);
			assert.deepEqual(Array.from(new Uint8Array(captured!)), [10, 20, 30]);
		});

		it("Should capture Blob request body and preserve downstream body", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			let downstreamBody: unknown;
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				downstreamBody = requestInit.body;
				return new Response("ok", { status: 200 });
			};
			handler.next = dummyFetchHandler;

			const blob = new Blob(["blob payload"], { type: "text/plain" });
			await handler.execute("https://example.com", { method: "POST", body: blob });

			const captured = options.requestBody;
			assert.isDefined(captured);
			assert.equal(new TextDecoder().decode(captured), "blob payload");

			assert.instanceOf(downstreamBody, Blob);
			const downstreamText = await (downstreamBody as Blob).text();
			assert.equal(downstreamText, "blob payload");
		});

		it("Should capture ReadableStream request body and preserve downstream bytes", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			let downstreamBody: unknown;
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				downstreamBody = requestInit.body;
				return new Response("ok", { status: 200 });
			};
			handler.next = dummyFetchHandler;

			const streamData = new TextEncoder().encode("streamed content");
			const stream = new ReadableStream<Uint8Array>({
				start(controller) {
					controller.enqueue(streamData);
					controller.close();
				},
			});

			await handler.execute("https://example.com", { method: "POST", body: stream as any });
			assert.isFalse(stream.locked);

			const captured = options.requestBody;
			assert.isDefined(captured);
			assert.equal(new TextDecoder().decode(captured), "streamed content");

			assert.instanceOf(downstreamBody, Uint8Array);
			assert.equal(new TextDecoder().decode(downstreamBody as Uint8Array), "streamed content");
		});

		it("Should replay a captured web stream body when RetryHandler retries", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const retryHandler = new RetryHandler(new RetryHandlerOptions({ delay: 0, maxRetries: 1 }));
			const received: string[] = [];
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				received.push(await new Response(requestInit.body).text());
				return received.length === 1 ? new Response(null, { status: 503, headers: { "Retry-After": "0" } }) : new Response("ok");
			};
			handler.next = dummyFetchHandler;
			retryHandler.next = handler;

			const stream = new ReadableStream<Uint8Array>({
				start(controller) {
					controller.enqueue(new TextEncoder().encode("retry payload"));
					controller.close();
				},
			});
			const requestInit = { method: "POST", headers: { "content-type": "application/json" }, body: stream as any };

			const response = await retryHandler.execute("https://example.com", requestInit);
			assert.equal(response.status, 200);
			assert.deepEqual(received, ["retry payload", "retry payload"]);
			assert.equal(new TextDecoder().decode(options.requestBody), "retry payload");
		});

		it("Should release a web stream reader when reading fails", async () => {
			const handler = new BodyInspectionHandler(new BodyInspectionOptions({ inspectRequestBody: true }));
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async () => new Response("ok");
			handler.next = dummyFetchHandler;

			const stream = new ReadableStream<Uint8Array>({
				pull() {
					throw new Error("stream failed");
				},
			});

			await expect(handler.execute("https://example.com", { method: "POST", body: stream as any })).rejects.toThrow("stream failed");
			assert.isFalse(stream.locked);
		});

		it("Should capture a Node-style readable body and replace it with replayable bytes", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			let downstreamBody: unknown;
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				downstreamBody = requestInit.body;
				return new Response("ok", { status: 200 });
			};
			handler.next = dummyFetchHandler;

			const nodeStyleBody = {
				async *[Symbol.asyncIterator](): AsyncGenerator<Uint8Array | string> {
					yield new TextEncoder().encode("node ");
					yield "stream";
				},
			};

			await handler.execute("https://example.com", { method: "POST", body: nodeStyleBody as any });

			assert.equal(new TextDecoder().decode(options.requestBody), "node stream");
			assert.instanceOf(downstreamBody, Uint8Array);
			assert.equal(new TextDecoder().decode(downstreamBody as Uint8Array), "node stream");
		});

		it("Should capture URLSearchParams request bodies", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			let downstreamBody: unknown;
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				downstreamBody = requestInit.body;
				return new Response("ok", { status: 200 });
			};
			handler.next = dummyFetchHandler;

			const body = new URLSearchParams({ query: "hello world" });
			await handler.execute("https://example.com", { method: "POST", body });

			assert.equal(new TextDecoder().decode(options.requestBody), "query=hello+world");
			assert.equal(downstreamBody, body);
		});

		it("Should leave request body undefined when there is no body", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.requestBody);
		});

		it("Should not capture request body when inspectRequestBody is false", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: false });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "POST", body: "ignored" });
			assert.isUndefined(options.requestBody);
		});
	});

	describe("response body inspection", () => {
		it("Should clear a previous response capture when inspection is disabled or cloning is unavailable", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async () => new Response("ok");
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "GET" });
			assert.isDefined(options.responseBody);

			options.inspectResponseBody = false;
			await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.responseBody);

			options.inspectResponseBody = true;
			await handler.execute("https://example.com", { method: "GET" });
			assert.isDefined(options.responseBody);

			dummyFetchHandler.execute = async () => ({ status: 200 }) as Response;
			await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.responseBody);
		});

		it("Should clear a previous response capture when cloning the next response fails", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: true });
			const handler = new BodyInspectionHandler(options);
			let requestCount = 0;
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async () => {
				requestCount++;
				const response = new Response(requestCount === 1 ? "first response" : "consumed response");
				if (requestCount === 2) {
					await response.text();
				}
				return response;
			};
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "GET" });
			assert.isDefined(options.responseBody);

			await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.responseBody);
		});

		it("Should capture response body and keep original response stream unconsumed for caller", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			const responseText = JSON.stringify({ user: "Alice", role: "admin" });
			dummyFetchHandler.setResponses([new Response(responseText, { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const response = await handler.execute("https://example.com", { method: "GET" });

			// Option contains the inspected body
			const captured = options.responseBody;
			assert.isDefined(captured);
			assert.equal(new TextDecoder().decode(captured), responseText);

			// Caller can still read the original response body!
			const callerText = await response.text();
			assert.equal(callerText, responseText);
		});

		it("Should leave response body undefined for empty responses", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response(null, { status: 204 })] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "DELETE" });
			assert.isUndefined(options.responseBody);
		});

		it("Should not capture response body when inspectResponseBody is false", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: false });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ignored response", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const response = await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.responseBody);
			assert.equal(await response.text(), "ignored response");
		});

		it("Should resolve options passed in requestOptions map", async () => {
			const handler = new BodyInspectionHandler(); // default options: disabled
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("scoped response", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const perRequestOptions = new BodyInspectionOptions({ inspectResponseBody: true });
			await handler.execute("https://example.com", { method: "GET" }, { [BodyInspectionOptionsKey]: perRequestOptions });

			assert.isDefined(perRequestOptions.responseBody);
			assert.equal(new TextDecoder().decode(perRequestOptions.responseBody), "scoped response");
		});

		it("Should expose captured buffers via requestBody and responseBody getter and setter properties", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true, inspectResponseBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("res text", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "POST", body: "req text" });

			assert.isDefined(options.requestBody);
			assert.equal(new TextDecoder().decode(options.requestBody), "req text");
			assert.isDefined(options.responseBody);
			assert.equal(new TextDecoder().decode(options.responseBody), "res text");

			const manualBuffer = new TextEncoder().encode("manual").buffer;
			options.requestBody = manualBuffer;
			assert.equal(options.requestBody, manualBuffer);
			options.responseBody = manualBuffer;
			assert.equal(options.responseBody, manualBuffer);
		});

		it("Should preserve independent captures for overlapping requests with scoped request options", async () => {
			const handler = new BodyInspectionHandler();
			let resolveReq1: (() => void) | undefined;
			const req1Blocked = new Promise<void>((resolve) => {
				resolveReq1 = resolve;
			});

			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				if (requestInit.body === "body-1") {
					await req1Blocked;
					return new Response("response-1", { status: 200 });
				}
				return new Response("response-2", { status: 200 });
			};
			handler.next = dummyFetchHandler;

			const options1 = new BodyInspectionOptions({ inspectRequestBody: true, inspectResponseBody: true });
			const options2 = new BodyInspectionOptions({ inspectRequestBody: true, inspectResponseBody: true });

			const req1Promise = handler.execute("https://example.com/1", { method: "POST", body: "body-1" }, { [BodyInspectionOptionsKey]: options1 });

			assert.isDefined(options1.requestBody);
			assert.equal(new TextDecoder().decode(options1.requestBody), "body-1");

			await handler.execute("https://example.com/2", { method: "POST", body: "body-2" }, { [BodyInspectionOptionsKey]: options2 });

			assert.isDefined(options2.requestBody);
			assert.equal(new TextDecoder().decode(options2.requestBody), "body-2");
			assert.isDefined(options2.responseBody);
			assert.equal(new TextDecoder().decode(options2.responseBody), "response-2");

			assert.equal(new TextDecoder().decode(options1.requestBody), "body-1");
			assert.isUndefined(options1.responseBody);

			resolveReq1?.();
			await req1Promise;

			assert.equal(new TextDecoder().decode(options1.requestBody), "body-1");
			assert.isDefined(options1.responseBody);
			assert.equal(new TextDecoder().decode(options1.responseBody), "response-1");
		});
	});

	describe("observability", () => {
		it("Should keep the body inspection span active until downstream execution completes", async () => {
			let spanEnded = false;
			let enabledAttribute: unknown;
			const testSpan = {
				setAttribute: (name: string, value: unknown) => {
					if (name === "com.microsoft.kiota.handler.bodyInspection.enable") {
						enabledAttribute = value;
					}
				},
				end: () => {
					spanEnded = true;
				},
			};
			const tracer = {
				startActiveSpan: (_name: string, callback: (span: typeof testSpan) => Promise<Response>) => callback(testSpan),
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as unknown as ReturnType<typeof trace.getTracer>);

			let releaseDownstream: (() => void) | undefined;
			const downstreamBlocked = new Promise<void>((resolve) => {
				releaseDownstream = resolve;
			});
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async () => {
				await downstreamBlocked;
				return new Response("ok");
			};
			const handler = new BodyInspectionHandler(new BodyInspectionOptions({ inspectResponseBody: true }));
			handler.next = dummyFetchHandler;

			try {
				const execution = handler.execute("https://example.com", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				await vi.waitFor(() => assert.isDefined(releaseDownstream));
				assert.isFalse(spanEnded);
				releaseDownstream?.();
				await execution;
				assert.isTrue(spanEnded);
				assert.isTrue(enabledAttribute);
			} finally {
				getTracerSpy.mockRestore();
			}
		});

		it("Should report body inspection as disabled when neither inspection option is enabled", async () => {
			let enabledAttribute: unknown;
			const testSpan = {
				setAttribute: (name: string, value: unknown) => {
					if (name === "com.microsoft.kiota.handler.bodyInspection.enable") {
						enabledAttribute = value;
					}
				},
				end: () => undefined,
			};
			const tracer = {
				startActiveSpan: (_name: string, callback: (span: typeof testSpan) => Promise<Response>) => callback(testSpan),
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as unknown as ReturnType<typeof trace.getTracer>);
			const handler = new BodyInspectionHandler();
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok")] as any);
			handler.next = dummyFetchHandler;

			try {
				await handler.execute("https://example.com", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.isFalse(enabledAttribute);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});
