/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";
import { CustomFetchHandler, HeadersInspectionHandler, MiddlewareFactory, ParametersNameDecodingHandler, RedirectHandler, RetryHandler, UserAgentHandler } from "../../src";
import { CompressionHandler } from "../../src/middlewares/compressionHandler";

describe("browser - MiddlewareFactory", () => {
	it("Should return the default pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getDefaultMiddlewares();
		assert.equal(defaultMiddleWareArray.length, 7);
		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof RedirectHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[3] instanceof UserAgentHandler);
		assert.isTrue(defaultMiddleWareArray[4] instanceof CompressionHandler);
		assert.isTrue(defaultMiddleWareArray[5] instanceof HeadersInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[6] instanceof CustomFetchHandler);
	});
});
