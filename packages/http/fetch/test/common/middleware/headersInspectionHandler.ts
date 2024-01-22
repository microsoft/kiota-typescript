/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert } from "chai";
import { Response } from "node-fetch";

import { HeadersInspectionHandler, HeadersInspectionOptions } from "../../../src";
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
			const options = new HeadersInspectionOptions({inspectRequestHeaders: true});
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
	});
});
