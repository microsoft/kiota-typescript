/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { inNodeEnv } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { CustomFetchHandler, HeadersInspectionHandler, BodyInspectionHandler, KiotaClientFactory, ParametersNameDecodingHandler, RedirectHandler, RetryHandler, UrlReplaceHandler, UserAgentHandler } from "../../src/browser";

describe("browser - KiotaClientFactory", () => {
	it("Should return the http client", () => {
		const httpClient = KiotaClientFactory.create();
		assert.isDefined(httpClient);
		assert.isDefined(httpClient["middleware"]);
		let middleware = httpClient["middleware"];
		const handlers = [];
		while (middleware && !(middleware instanceof CustomFetchHandler)) {
			handlers.push(middleware.constructor);
			middleware = middleware.next;
		}
		assert.deepEqual(handlers, [UrlReplaceHandler, ParametersNameDecodingHandler, UserAgentHandler, ...(inNodeEnv() ? [RedirectHandler] : []), RetryHandler, HeadersInspectionHandler, BodyInspectionHandler]);
		assert.instanceOf(middleware, CustomFetchHandler);
	});
});
