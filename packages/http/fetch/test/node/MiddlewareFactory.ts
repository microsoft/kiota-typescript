/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert } from "chai";

import { CustomFetchHandler, MiddlewareFactory, ParametersNameDecodingHandler, RedirectHandler, RetryHandler } from "../../src";

describe("MiddlewareFactory", () => {
	it("Should return the default pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getDefaultMiddlewareChain();
		assert.equal(defaultMiddleWareArray.length, 4);

		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof RedirectHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[3] instanceof CustomFetchHandler);
	});
});
