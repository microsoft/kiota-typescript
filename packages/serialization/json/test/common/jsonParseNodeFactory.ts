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
	it("jsonParseNodeFactory:getsRootParseNodeForJsonContentType", () => {
		const factory = new JsonParseNodeFactory();
		const sampleArrayBuffer = new TextEncoder().encode('{ "subject": "subject-value" }');

		const parseNode = factory.getRootParseNode(factory.getValidContentType(), sampleArrayBuffer);
		assert.isDefined(parseNode);
	});
	it("jsonParseNodeFactory:throwsForInvalidContentType", () => {
		const factory = new JsonParseNodeFactory();
		const sampleArrayBuffer = new TextEncoder().encode('{ "subject": "subject-value" }');

		assert.throw(() => factory.getRootParseNode("text/plain", sampleArrayBuffer));
	});
	it("jsonParseNodeFactory:throwsForNoContentType", () => {
		const factory = new JsonParseNodeFactory();
		const sampleArrayBuffer = new TextEncoder().encode('{ "subject": "subject-value" }');

		assert.throw(() => factory.getRootParseNode("", sampleArrayBuffer));
		assert.throw(() => factory.getRootParseNode(undefined as unknown as string, sampleArrayBuffer));
	});
	it("jsonParseNodeFactory:throwsForEmptyContent", () => {
		const factory = new JsonParseNodeFactory();

		assert.throw(() => factory.getRootParseNode(factory.getValidContentType(), undefined as unknown as ArrayBuffer));
	});
	it("jsonParseNodeFactory:getsRootParseNodeForJsonContentTypeWithParameters", () => {
		const factory = new JsonParseNodeFactory();
		const sampleArrayBuffer = new TextEncoder().encode('{ "subject": "subject-value" }');

		assert.isDefined(factory.getRootParseNode("application/json; charset=utf-8", sampleArrayBuffer));
		assert.isDefined(factory.getRootParseNode("APPLICATION/JSON", sampleArrayBuffer));
		assert.isDefined(factory.getRootParseNode(" application/json ; charset=UTF-8 ", sampleArrayBuffer));
		assert.isDefined(factory.getRootParseNode("application/json;odata.metadata=minimal", sampleArrayBuffer));
	});
});
