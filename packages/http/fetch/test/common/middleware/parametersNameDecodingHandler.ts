/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { assert } from "chai";

import { ParametersNameDecodingHandler } from "../../../src/middlewares/parametersNameDecodingHandler";
import { TestCallBackMiddleware } from "./testCallBackMiddleware";

describe("parametersNameDecodingHandler", function () {
	const handler = new ParametersNameDecodingHandler();

	const data = [
		{ input: "http://localhost?%24select=diplayName&api%2Dversion=2", expected: "http://localhost?$select=diplayName&api-version=2" },
		{ input: "http://localhost?%24select=diplayName&api%7Eversion=2", expected: "http://localhost?$select=diplayName&api~version=2" },
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=2", expected: "http://localhost?$select=diplayName&api.version=2" },
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=2", expected: "http://localhost?$select=diplayName&api.version=2" },
		{ input: "http://localhost:888?%24select=diplayName&api%2Dversion=2", expected: "http://localhost:888?$select=diplayName&api-version=2" },
		{ input: "http://localhost", expected: "http://localhost" },
		{ input: "https://google.com/?q=1%2B2", expected: "https://google.com/?q=1%2B2" }, //Values are not decoded
		{ input: "https://google.com/?q=M%26A", expected: "https://google.com/?q=M%26A" }, //Values are not decoded
		{ input: "https://google.com/?q%2D1=M%26A", expected: "https://google.com/?q-1=M%26A" }, //Values are not decoded but params are
		{ input: "https://google.com/?q%2D1&q=M%26A=M%26A", expected: "https://google.com/?q-1&q=M%26A=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost:888?%24select=diplayName&api%2Dversion=1%2B2", expected: "http://localhost:888?$select=diplayName&api-version=1%2B2" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%2Dversion=M%26A", expected: "http://localhost?$select=diplayName&api-version=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%7Eversion=M%26A", expected: "http://localhost?$select=diplayName&api~version=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=M%26A", expected: "http://localhost?$select=diplayName&api.version=M%26A" }, //Values are not decoded but params are
		{ input: "http://localhost?%24select=diplayName&api%2Eversion=M%26A", expected: "http://localhost?$select=diplayName&api.version=M%26A" }, //Values are not decoded but params are
	];
	data.forEach((entry) => {
		it(`Should decode the parameters names ${entry.expected}`, async () => {
			let wasCalled = false;
			const fetchRequestInit = {
				method: "GET",
			};
			const requestInformationOptions = {};
			handler.next = new TestCallBackMiddleware((url: string) => {
				assert.equal(url, entry.expected);
				wasCalled = true;
			});
			await handler["execute"](entry.input, fetchRequestInit, requestInformationOptions);
			assert.isTrue(wasCalled);
		});
	});
});
