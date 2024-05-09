/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { JsonParseNodeFactory } from "../../src/index";

describe("jsonParseNodeFactory", () => {
	it("jsonParseNodeFactory", async () => {
		const jsonParseNodeFactory = new JsonParseNodeFactory();
		assert.isDefined(jsonParseNodeFactory);
	});
	it("jsonParseNodeFactory:convertArrayBufferToJson should convert an array to json", async () => {
		const jsonParseNodeFactory = new JsonParseNodeFactory();

		const expectedJson = '{ "subject": "subject-value" }';
		const sampleArrayBuffer = new TextEncoder().encode(expectedJson);

		const outputJson = jsonParseNodeFactory["convertArrayBufferToJson"](sampleArrayBuffer);

		assert.equal(outputJson.subject, JSON.parse(expectedJson).subject);
	});
});
