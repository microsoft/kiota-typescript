/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { CustomFetchHandler, HeadersInspectionHandler, HttpClient, MiddlewareFactory, ParametersNameDecodingHandler, RedirectHandler, RetryHandler, UrlReplaceHandler, UserAgentHandler, CompressionHandler } from "../../src";
import { DummyFetchHandler } from "../common/middleware/dummyFetchHandler";

describe("browser - HTTPClient.ts", () => {
	describe("constructor", () => {
		const dummyFetchHandler: DummyFetchHandler = new DummyFetchHandler();

		const dummyCustomFetch = (): Promise<Response> => {
			return Promise.resolve(null as unknown as Response);
		};
		it("Should create an instance and populate middleware member", async () => {
			const httpClient: HttpClient = new HttpClient(undefined, dummyFetchHandler);
			assert.isDefined(httpClient["middleware"]);
			assert.equal(httpClient["middleware"], dummyFetchHandler);
		});

		it("Should create an instance and populate middleware member when passing a middleware array", () => {
			const client = new HttpClient(undefined, ...[dummyFetchHandler]);
			assert.isDefined(client["middleware"]);
			assert.equal(client["middleware"], dummyFetchHandler);
		});

		it("Should set default middleware array if middleware parameter is undefined && customFetch is undefined", () => {
			const client = new HttpClient();

			assert.isNotNull(client["middleware"]);
			const next = client["middleware"]?.next;

			assert.isTrue(client["middleware"] instanceof RetryHandler);
			assert.isTrue(next instanceof RedirectHandler);
			assert.isTrue(next?.next instanceof ParametersNameDecodingHandler);
			assert.isTrue(next?.next?.next instanceof UserAgentHandler);
			assert.isTrue(next?.next?.next?.next instanceof HeadersInspectionHandler);
			assert.isTrue(next?.next?.next?.next?.next instanceof UrlReplaceHandler);
			assert.isTrue(next?.next?.next?.next?.next?.next instanceof CustomFetchHandler);
		});

		it("Should set default middleware array with customFetchHandler if middleware parameter is undefined && customFetch is defined", () => {
			const client = new HttpClient(dummyCustomFetch);

			assert.isNotNull(client["middleware"]);
			assert.isNotNull(client[""]);

			const next = client["middleware"]?.next;

			assert.isTrue(next instanceof RedirectHandler);
			assert.isTrue(next?.next instanceof ParametersNameDecodingHandler);
			assert.isTrue(next?.next?.next instanceof UserAgentHandler);
			assert.isTrue(next?.next?.next?.next instanceof HeadersInspectionHandler);
			assert.isTrue(next?.next?.next?.next?.next instanceof UrlReplaceHandler);
			assert.isTrue(next?.next?.next?.next?.next?.next instanceof CustomFetchHandler);
		});

		it("Should set to default fetch handler middleware array if middleware parameter is null && customFetch is undefined", () => {
			const client = new HttpClient(undefined);

			assert.isNotNull(client["middleware"]);

			assert.isTrue(client["middleware"] instanceof RetryHandler);
		});

		it("Should set to custom fetch with default middleware chain if middleware parameter is null && customFetch is defined", () => {
			const client = new HttpClient(dummyCustomFetch);

			assert.isDefined(client["middleware"]);
			assert.equal(client["customFetch"], dummyCustomFetch);
			assert.isTrue(client["middleware"]?.next?.next?.next?.next?.next?.next?.next instanceof CustomFetchHandler);
		});

		it("Should set performance middleware for the http client", () => {
			const client = new HttpClient(null, ...MiddlewareFactory.getPerformanceMiddlewares());

			assert.isNotNull(client["middleware"]);
			const next = client["middleware"].next;

			assert.isTrue(client["middleware"] instanceof RetryHandler);
			assert.isTrue(next instanceof RedirectHandler);
			assert.isTrue(next?.next instanceof ParametersNameDecodingHandler);
			assert.isTrue(next?.next?.next instanceof UserAgentHandler);
			assert.isTrue(next?.next?.next?.next instanceof CompressionHandler);
			assert.isTrue(next?.next?.next?.next?.next instanceof HeadersInspectionHandler);
			assert.isTrue(next?.next?.next?.next?.next?.next instanceof UrlReplaceHandler);
			assert.isTrue(next?.next?.next?.next?.next?.next?.next instanceof CustomFetchHandler);
		});
	});
});
