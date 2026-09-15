/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { BodyInspectionHandler, BodyInspectionOptions, BodyInspectionOptionsKey } from "../../../src";
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

			const capturedBuffer = options.getRequestBody();
			assert.isDefined(capturedBuffer);
			const capturedText = new TextDecoder().decode(capturedBuffer);
			assert.equal(capturedText, bodyText);
			assert.equal(receivedBody, bodyText);

			const stream = options.getRequestBodyStream();
			assert.isDefined(stream);
			const reader = stream!.getReader();
			const { value } = await reader.read();
			assert.equal(new TextDecoder().decode(value), bodyText);
		});

		it("Should capture ArrayBuffer request body", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const sourceData = new Uint8Array([1, 2, 3, 4, 5]);
			await handler.execute("https://example.com", { method: "POST", body: sourceData.buffer });

			const captured = options.getRequestBody();
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

			const captured = options.getRequestBody();
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

			const captured = options.getRequestBody();
			assert.isDefined(captured);
			assert.equal(new TextDecoder().decode(captured), "blob payload");

			assert.instanceOf(downstreamBody, Blob);
			const downstreamText = await (downstreamBody as Blob).text();
			assert.equal(downstreamText, "blob payload");
		});

		it("Should capture ReadableStream request body using tee", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			let downstreamStream: unknown;
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.execute = async (_url, requestInit) => {
				downstreamStream = requestInit.body;
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

			const captured = options.getRequestBody();
			assert.isDefined(captured);
			assert.equal(new TextDecoder().decode(captured), "streamed content");

			// Downstream stream should still be readable
			const downstreamReader = (downstreamStream as ReadableStream<Uint8Array>).getReader();
			const { value } = await downstreamReader.read();
			assert.equal(new TextDecoder().decode(value), "streamed content");
		});

		it("Should leave request body undefined when there is no body", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.getRequestBody());
			assert.isUndefined(options.getRequestBodyStream());
		});

		it("Should not capture request body when inspectRequestBody is false", async () => {
			const options = new BodyInspectionOptions({ inspectRequestBody: false });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "POST", body: "ignored" });
			assert.isUndefined(options.getRequestBody());
		});
	});

	describe("response body inspection", () => {
		it("Should capture response body and keep original response stream unconsumed for caller", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			const responseText = JSON.stringify({ user: "Alice", role: "admin" });
			dummyFetchHandler.setResponses([new Response(responseText, { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const response = await handler.execute("https://example.com", { method: "GET" });

			// Option contains the inspected body
			const captured = options.getResponseBody();
			assert.isDefined(captured);
			assert.equal(new TextDecoder().decode(captured), responseText);

			// Caller can still read the original response body!
			const callerText = await response.text();
			assert.equal(callerText, responseText);

			// Stream helper returns a fresh stream
			const stream = options.getResponseBodyStream();
			assert.isDefined(stream);
			const reader = stream!.getReader();
			const { value } = await reader.read();
			assert.equal(new TextDecoder().decode(value), responseText);
		});

		it("Should leave response body undefined for empty responses", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: true });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response(null, { status: 204 })] as any);
			handler.next = dummyFetchHandler;

			await handler.execute("https://example.com", { method: "DELETE" });
			assert.isUndefined(options.getResponseBody());
			assert.isUndefined(options.getResponseBodyStream());
		});

		it("Should not capture response body when inspectResponseBody is false", async () => {
			const options = new BodyInspectionOptions({ inspectResponseBody: false });
			const handler = new BodyInspectionHandler(options);
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("ignored response", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const response = await handler.execute("https://example.com", { method: "GET" });
			assert.isUndefined(options.getResponseBody());
			assert.equal(await response.text(), "ignored response");
		});

		it("Should resolve options passed in requestOptions map", async () => {
			const handler = new BodyInspectionHandler(); // default options: disabled
			const dummyFetchHandler = new DummyFetchHandler();
			dummyFetchHandler.setResponses([new Response("scoped response", { status: 200 })] as any);
			handler.next = dummyFetchHandler;

			const perRequestOptions = new BodyInspectionOptions({ inspectResponseBody: true });
			await handler.execute("https://example.com", { method: "GET" }, { [BodyInspectionOptionsKey]: perRequestOptions });

			assert.isDefined(perRequestOptions.getResponseBody());
			assert.equal(new TextDecoder().decode(perRequestOptions.getResponseBody()), "scoped response");
		});
	});
});
