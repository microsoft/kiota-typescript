/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert } from "chai";

import { HeadersInspectionHandler } from "../../src";
import { CustomFetchHandler, MiddlewareFactory, ParametersNameDecodingHandler, RetryHandler, UserAgentHandler } from "../../src/browser";

describe("browser - MiddlewareFactory", () => {
	it("Should return the default pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getDefaultMiddlewareChain();

		assert.equal(defaultMiddleWareArray.length, 5);
		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof UserAgentHandler);
		assert.isTrue(defaultMiddleWareArray[3] instanceof HeadersInspectionHandler);
		assert.isTrue(defaultMiddleWareArray[4] instanceof CustomFetchHandler);
	});
});
