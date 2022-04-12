/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert } from "chai";

import { CustomFetchHandler, MiddlewareFactory, ParametersNameDecodingHandler, RetryHandler } from "../../src/browser";

describe("MiddlewareFactory", () => {
	it("Should return the default pipeline", () => {
		const defaultMiddleWareArray = MiddlewareFactory.getDefaultMiddlewareChain();

		assert.equal(defaultMiddleWareArray.length, 3);
		assert.isTrue(defaultMiddleWareArray[0] instanceof RetryHandler);
		assert.isTrue(defaultMiddleWareArray[1] instanceof ParametersNameDecodingHandler);
		assert.isTrue(defaultMiddleWareArray[2] instanceof CustomFetchHandler);
	});
});
