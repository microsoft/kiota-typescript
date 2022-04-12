/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { assert } from "chai";

import { ParametersNameDecodingHandler } from "../../../src/middlewares/parametersNameDecodingHandler";
import { getResponse } from "../../testUtils";
import { TestCallBackMiddleware } from "./testCallBackMiddleware";

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
