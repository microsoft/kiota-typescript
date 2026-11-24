/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { HttpClient, Middleware, MiddlewareFactory, UrlReplaceHandler } from "../../src";
import { DummyFetchHandler } from "../common/middleware/dummyFetchHandler";

describe("browser - HTTPClient.ts", () => {
	describe("constructor", () => {
		const dummyFetchHandler: DummyFetchHandler = new DummyFetchHandler();
		const assertPipeline = (client: HttpClient, expected: Middleware[]) => {
			let handler = client["middleware"];
			for (const expectedHandler of expected) {
				assert.equal(handler?.constructor, expectedHandler.constructor);
				handler = handler?.next;
			}
		};

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

			assertPipeline(client, MiddlewareFactory.getDefaultMiddlewares());
		});

		it("Should set default middleware array with customFetchHandler if middleware parameter is undefined && customFetch is defined", () => {
			const client = new HttpClient(dummyCustomFetch);

			assert.isNotNull(client["middleware"]);
			assert.isNotNull(client[""]);

			assertPipeline(client, MiddlewareFactory.getDefaultMiddlewares());
		});

		it("Should set to default fetch handler middleware array if middleware parameter is null && customFetch is undefined", () => {
			const client = new HttpClient(undefined);

			assert.isNotNull(client["middleware"]);

			assert.isTrue(client["middleware"] instanceof UrlReplaceHandler);
		});

		it("Should set to custom fetch with default middleware chain if middleware parameter is null && customFetch is defined", () => {
			const client = new HttpClient(dummyCustomFetch);

			assert.isDefined(client["middleware"]);
			assert.equal(client["customFetch"], dummyCustomFetch);
			assertPipeline(client, MiddlewareFactory.getDefaultMiddlewares());
		});

		it("Should set performance middleware for the http client", () => {
			const client = new HttpClient(null, ...MiddlewareFactory.getPerformanceMiddlewares());

			assertPipeline(client, MiddlewareFactory.getPerformanceMiddlewares());
		});
	});
});
