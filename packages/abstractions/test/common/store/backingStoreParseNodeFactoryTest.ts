/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { BackingStoreParseNodeFactory } from "../../../src/store";
import { assert, describe, it } from "vitest";
import { ParseNodeFactory } from "../../../src";

describe("BackingStoreParseNodeFactory", () => {
	describe("constructor", () => {
		it("Should create an instance of backing store factory", async () => {
			const fakeParseNodeFactory: ParseNodeFactory = {} as ParseNodeFactory;
			const backingStoreParseNodeFactory: BackingStoreParseNodeFactory = new BackingStoreParseNodeFactory(fakeParseNodeFactory);
			assert.isDefined(backingStoreParseNodeFactory);
		});
	});
});
