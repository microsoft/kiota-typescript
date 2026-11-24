/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { inNodeEnv } from "@microsoft/kiota-abstractions";
import { CustomFetchHandler, HeadersInspectionHandler, HeadersInspectionOptions, BodyInspectionHandler, BodyInspectionOptions, HttpClient, MiddlewareFactory, ParametersNameDecodingHandler, RedirectHandler, RetryHandler, RetryHandlerOptions, UrlReplaceHandler, UserAgentHandler, CompressionHandler } from "../../src";

describe("node - MiddlewareFactory", () => {
	const prefix = [UrlReplaceHandler, ParametersNameDecodingHandler, UserAgentHandler];
	const suffix = [...(inNodeEnv() ? [RedirectHandler] : []), RetryHandler, HeadersInspectionHandler, BodyInspectionHandler, CustomFetchHandler];
	it("Should return the default pipeline", () => {
		assert.deepEqual(
			MiddlewareFactory.getDefaultMiddlewares().map((handler) => handler.constructor),
			[...prefix, ...suffix],
		);
	});
	it("Should return the performance pipeline", () => {
		assert.deepEqual(
			MiddlewareFactory.getPerformanceMiddlewares().map((handler) => handler.constructor),
			[...prefix, CompressionHandler, ...suffix],
		);
	});
	it.skipIf(!inNodeEnv())("Should retry each redirect hop independently with Node fetch", async () => {
		const { createServer } = await import("node:http");
		const calls: { url?: string; method?: string; body: string; encoding?: string; contentType?: string; retryAttempt?: string }[] = [];
		const server = createServer(async (req, res) => {
			const body = [];
			for await (const chunk of req) {
				body.push(chunk);
			}
			calls.push({ url: req.url, method: req.method, body: Buffer.concat(body).toString(), encoding: req.headers["content-encoding"], contentType: req.headers["content-type"], retryAttempt: req.headers["retry-attempt"] as string | undefined });
			if (calls.length % 2 === 1) {
				res.writeHead(504, { "Retry-After": "0" });
			} else if (req.url === "/send") {
				res.writeHead(303, { Location: "/redirected" });
			}
			res.end();
		});
		await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
		try {
			const address = server.address();
			assert.isObject(address);
			const options = new RetryHandlerOptions({ maxRetries: 1 });
			const url = `http://127.0.0.1:${(address as { port: number }).port}/send`;
			const response = await new HttpClient().executeFetch(url, { method: "POST", body: "payload", headers: new Headers({ "Content-Type": "text/plain", "Content-Encoding": "identity" }) }, { [options.getKey()]: options });
			assert.equal(response.status, 200);
			assert.deepEqual(calls, [
				{ url: "/send", method: "POST", body: "payload", encoding: "identity", contentType: "text/plain", retryAttempt: undefined },
				{ url: "/send", method: "POST", body: "payload", encoding: "identity", contentType: "text/plain", retryAttempt: "1" },
				{ url: "/redirected", method: "GET", body: "", encoding: undefined, contentType: undefined, retryAttempt: undefined },
				{ url: "/redirected", method: "GET", body: "", encoding: undefined, contentType: undefined, retryAttempt: "1" },
			]);
		} finally {
			server.closeAllConnections();
			await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
		}
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
		assert.deepEqual(options.requestBody, sentBody);
		assert.equal(sentEncoding, "gzip");
		assert.instanceOf(sentBody, ArrayBuffer);
		assert.equal(await new Response(new Blob([sentBody as ArrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"))).text(), "streamed payload");
	});
	it.skipIf(!inNodeEnv())("Should restore inspected Node stream bytes after compression is rejected", async () => {
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
	it.skipIf(!inNodeEnv())("Should not replay the original compressed POST after a body-dropping redirect receives a 415", async () => {
		const calls: { url: string; method?: string; body: BodyInit | null | undefined; encoding: string | null }[] = [];
		const client = new HttpClient(
			undefined,
			...MiddlewareFactory.getPerformanceMiddlewares(async (url, init) => {
				calls.push({ url, method: init.method, body: init.body, encoding: new Headers(init.headers).get("Content-Encoding") });
				return calls.length === 1 ? new Response(null, { status: 303, headers: { Location: "/redirected" } }) : new Response(null, { status: 415 });
			}),
		);
		const response = await client.executeFetch("https://example.com/send", { method: "POST", body: "payload" });
		assert.equal(response.status, 415);
		assert.lengthOf(calls, 2);
		assert.equal(calls[0].encoding, "gzip");
		assert.deepEqual(calls[1], { url: "https://example.com/redirected", method: "GET", body: undefined, encoding: null });
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
		assert.deepEqual(options.requestBody, sentBody);
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
		assert.equal(await new Response(new Blob([bodyOptions.requestBody!]).stream().pipeThrough(new DecompressionStream("gzip"))).text(), "query=hello+world");
		assert.equal(new Headers(sentHeaders).get("Content-Type"), "application/x-www-form-urlencoded; charset=utf-8");
		assert.equal(headerOptions.getRequestHeaders().tryGetValue("content-type")?.[0], "application/x-www-form-urlencoded; charset=utf-8");
		assert.equal(headerOptions.getRequestHeaders().tryGetValue("content-encoding")?.[0], "gzip");
	});
});
