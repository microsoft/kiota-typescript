/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { RequestOption } from "@microsoft/kiota-abstractions";
import { assert } from "chai";

import { Middleware } from "../../../src/middlewares/middleware";
import { ParametersNameDecodingHandler } from "../../../src/middlewares/parametersNameDecodingHandler";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";

// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}
describe("parametersNameDecodingHandler", function () {
	const handler = new ParametersNameDecodingHandler();

	const data = [
		{ input: "http://localhost?%24select=diplayName&api%2Dversion=2", expected: "http://localhost?$select=diplayName&api-version=2" },
		{ input: "http://localhost?%24select=diplayName&api%7Eversion=2", expected: "http://localhost?$select=diplayName&api~version=2" },
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=2", expected: "http://localhost?$select=diplayName&api.version=2" },
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=2", expected: "http://localhost?$select=diplayName&api.version=2" },
		{ input: "http://localhost:888?%24select=diplayName&api%2Dversion=2", expected: "http://localhost:888?$select=diplayName&api-version=2" },
		{ input: "http://localhost", expected: "http://localhost" },
	];
	data.forEach((entry) => {
		it(`Should decode the parameters names ${entry.expected}`, async () => {
			const fetchRequestInit = {
				method: "GET",
			};
			const requestInformationOptions = {};
			handler.next = new CallBackMiddleware((url: string) => {
				assert.equal(url, entry.expected);
			});
			await handler["execute"](entry.input, fetchRequestInit, requestInformationOptions);
		});
	});
});

class CallBackMiddleware implements Middleware {
	constructor(private callback: (url: string) => void) {}
	next: Middleware = new DummyFetchHandler();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		this.callback(url);
		return new Response("ok", { status: 200 });
	}
}
