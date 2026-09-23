/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { CustomFetchHandler, HeadersInspectionHandler, BodyInspectionHandler, BodyInspectionOptions, HttpClient, MiddlewareFactory, ParametersNameDecodingHandler, RedirectHandler, RetryHandler, UrlReplaceHandler, UserAgentHandler, CompressionHandler } from "../../src";

describe("node - MiddlewareFactory", () => {
	it("Should return the default pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getDefaultMiddlewares();
		assert.equal(defaultMiddleWareArray.length, 8);

		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof RedirectHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[3] instanceof UserAgentHandler);
		assert.isTrue(defaultMiddleWareArray[4] instanceof HeadersInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[5] instanceof BodyInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[6] instanceof UrlReplaceHandler);
		assert.isTrue(defaultMiddleWareArray[7] instanceof CustomFetchHandler);
	});
	it("Should return the performance pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getPerformanceMiddlewares();
		assert.equal(defaultMiddleWareArray.length, 9);

		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof RedirectHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[3] instanceof UserAgentHandler);
		assert.isTrue(defaultMiddleWareArray[4] instanceof BodyInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[5] instanceof CompressionHandler);
		assert.isTrue(defaultMiddleWareArray[6] instanceof HeadersInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[7] instanceof UrlReplaceHandler);
		assert.isTrue(defaultMiddleWareArray[8] instanceof CustomFetchHandler);
	});
	it("Should inspect and compress a streamed request in the performance pipeline", async () => {
		const options = new BodyInspectionOptions({ inspectRequestBody: true });
		let sentBody: BodyInit | null | undefined;
		let sentEncoding: string | null = null;
		const client = new HttpClient(
			undefined,
			...MiddlewareFactory.getPerformanceMiddlewares(async (_url, init) => {
				sentBody = init.body;
				sentEncoding = new Headers(init.headers).get("Content-Encoding");
				return new Response("ok");
			}),
		);
		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(new TextEncoder().encode("streamed payload"));
				controller.close();
			},
		});

		const response = await client.executeFetch("https://example.com", { method: "POST", body: stream }, { [options.getKey()]: options });
		assert.equal(response.status, 200);
		assert.equal(new TextDecoder().decode(options.requestBody), "streamed payload");
		assert.equal(sentEncoding, "gzip");
		assert.instanceOf(sentBody, ArrayBuffer);
		assert.equal(await new Response(new Blob([sentBody as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"))).text(), "streamed payload");
	});
	it("Should restore inspected stream bytes after compression is rejected", async () => {
		const options = new BodyInspectionOptions({ inspectRequestBody: true });
		const sent: { body: BodyInit | null | undefined; encoding: string | null }[] = [];
		const client = new HttpClient(
			undefined,
			...MiddlewareFactory.getPerformanceMiddlewares(async (_url, init) => {
				sent.push({ body: init.body, encoding: new Headers(init.headers).get("Content-Encoding") });
				return sent.length === 1 ? new Response(null, { status: 415 }) : new Response("ok");
			}),
		);
		const body = {
			async *[Symbol.asyncIterator](): AsyncGenerator<Uint8Array> {
				yield new TextEncoder().encode("node stream");
			},
		};

		const response = await client.executeFetch("https://example.com", { method: "POST", body: body as BodyInit }, { [options.getKey()]: options });
		assert.equal(response.status, 200);
		assert.equal(new TextDecoder().decode(options.requestBody), "node stream");
		assert.equal(sent.length, 2);
		assert.equal(sent[0].encoding, "gzip");
		assert.instanceOf(sent[0].body, ArrayBuffer);
		assert.equal(await new Response(new Blob([sent[0].body as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"))).text(), "node stream");
		assert.isNull(sent[1].encoding);
		assert.equal(new TextDecoder().decode(sent[1].body as Uint8Array), "node stream");
	});
});
