/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { CustomFetchHandler, HeadersInspectionHandler, KiotaClientFactory, ParametersNameDecodingHandler, RedirectHandler, RetryHandler, UrlReplaceHandler, UserAgentHandler } from "../../src";
import { CompressionHandler } from "../../src/middlewares/compressionHandler";

describe("browser - KiotaClientFactory", () => {
	it("Should return the http client", () => {
		const httpClient = KiotaClientFactory.create();
		assert.isDefined(httpClient);
		assert.isDefined(httpClient["middleware"]);
		const middleware = httpClient["middleware"];
		assert.isTrue(middleware instanceof RetryHandler);
		assert.isTrue(middleware?.next instanceof RedirectHandler);
		assert.isTrue(middleware?.next?.next instanceof ParametersNameDecodingHandler);
		assert.isTrue(middleware?.next?.next?.next instanceof UserAgentHandler);
		assert.isTrue(middleware?.next?.next?.next?.next instanceof CompressionHandler);
		assert.isTrue(middleware?.next?.next?.next?.next?.next instanceof HeadersInspectionHandler);
		assert.isTrue(middleware?.next?.next?.next?.next?.next?.next instanceof UrlReplaceHandler);
		assert.isTrue(middleware?.next?.next?.next?.next?.next?.next?.next instanceof CustomFetchHandler);
	});
});
