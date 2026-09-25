/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";
import { CustomFetchHandler, HeadersInspectionHandler, HeadersInspectionOptions, BodyInspectionHandler, BodyInspectionOptions, HttpClient, MiddlewareFactory, ParametersNameDecodingHandler, RetryHandler, UrlReplaceHandler, UserAgentHandler, CompressionHandler } from "../../src/browser";

describe("browser - MiddlewareFactory", () => {
	it("Should return the default pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getDefaultMiddlewares();
		assert.equal(defaultMiddleWareArray.length, 7);
		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof UserAgentHandler);
		assert.isTrue(defaultMiddleWareArray[3] instanceof HeadersInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[4] instanceof BodyInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[5] instanceof UrlReplaceHandler);
		assert.isTrue(defaultMiddleWareArray[6] instanceof CustomFetchHandler);
	});
	it("Should return the performance pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getPerformanceMiddlewares();
		assert.equal(defaultMiddleWareArray.length, 8);
		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof UserAgentHandler);
		assert.isTrue(defaultMiddleWareArray[3] instanceof BodyInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[4] instanceof CompressionHandler);
		assert.isTrue(defaultMiddleWareArray[5] instanceof HeadersInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[6] instanceof UrlReplaceHandler);
		assert.isTrue(defaultMiddleWareArray[7] instanceof CustomFetchHandler);
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
	it("Should preserve URL-encoded bodies and content type in the performance pipeline", async () => {
		const options = new BodyInspectionOptions({ inspectRequestBody: true });
		let sentBody: BodyInit | null | undefined;
		let sentHeaders: HeadersInit | undefined;
		const client = new HttpClient(
			undefined,
			...MiddlewareFactory.getPerformanceMiddlewares(async (_url, init) => {
				sentBody = init.body;
				sentHeaders = init.headers;
				return new Response("ok");
			}),
		);

		const response = await client.executeFetch("https://example.com", { method: "POST", body: new URLSearchParams({ query: "hello world", symbol: "é" }) }, { [options.getKey()]: options });
		assert.equal(response.status, 200);
		assert.equal(new TextDecoder().decode(options.requestBody), "query=hello+world&symbol=%C3%A9");
		assert.equal(new Headers(sentHeaders).get("Content-Type"), "application/x-www-form-urlencoded;charset=UTF-8");
		assert.equal(new Headers(sentHeaders).get("Content-Encoding"), "gzip");
		assert.instanceOf(sentBody, ArrayBuffer);
		assert.equal(await new Response(new Blob([sentBody as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"))).text(), "query=hello+world&symbol=%C3%A9");
	});
	it("Should inspect headers alongside a compressed URL-encoded body", async () => {
		const bodyOptions = new BodyInspectionOptions({ inspectRequestBody: true });
		const headerOptions = new HeadersInspectionOptions({ inspectRequestHeaders: true });
		let sentHeaders: HeadersInit | undefined;
		const client = new HttpClient(
			undefined,
			...MiddlewareFactory.getPerformanceMiddlewares(async (_url, init) => {
				sentHeaders = init.headers;
				return new Response("ok");
			}),
		);
		const response = await client.executeFetch("https://example.com", { method: "POST", body: new URLSearchParams({ query: "hello world" }), headers: new Headers({ "content-type": "application/x-www-form-urlencoded; charset=utf-8" }) }, { [bodyOptions.getKey()]: bodyOptions, [headerOptions.getKey()]: headerOptions });
		assert.equal(response.status, 200);
		assert.equal(new TextDecoder().decode(bodyOptions.requestBody), "query=hello+world");
		assert.equal(new Headers(sentHeaders).get("Content-Type"), "application/x-www-form-urlencoded; charset=utf-8");
		assert.equal(headerOptions.getRequestHeaders().tryGetValue("content-type")?.[0], "application/x-www-form-urlencoded; charset=utf-8");
		assert.equal(headerOptions.getRequestHeaders().tryGetValue("content-encoding")?.[0], "gzip");
	});
});
