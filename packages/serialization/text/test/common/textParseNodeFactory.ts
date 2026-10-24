/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { TextParseNodeFactory } from "../../src/index";

describe("textParseNodeFactory", () => {
	it("textParseNodeFactory", async () => {
		const textParseNodeFactory = new TextParseNodeFactory();
		assert.isDefined(textParseNodeFactory);
	});
	it("textParseNodeFactory:convertArrayBufferToText should convert an array to text", async () => {
		const textParseNodeFactory = new TextParseNodeFactory();

		const expectedText = "hello serializer";
		const sampleArrayBuffer = new TextEncoder().encode(expectedText);

		const outputText = textParseNodeFactory["convertArrayBufferToText"](sampleArrayBuffer);

		assert.equal(outputText, expectedText);
	});

	it("supports content type with parameters and whitespace", () => {
		const textParseNodeFactory = new TextParseNodeFactory();
		const sampleArrayBuffer = new TextEncoder().encode("hello serializer");

		const node1 = textParseNodeFactory.getRootParseNode("text/plain; charset=utf-8", sampleArrayBuffer);
		assert.isDefined(node1);
		assert.equal(node1.getStringValue(), "hello serializer");

		const node2 = textParseNodeFactory.getRootParseNode("  TEXT/PLAIN; charset=utf-8  ", sampleArrayBuffer);
		assert.isDefined(node2);
		assert.equal(node2.getStringValue(), "hello serializer");
	});
});
