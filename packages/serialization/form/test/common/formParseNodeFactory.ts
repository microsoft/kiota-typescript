/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { FormParseNodeFactory } from "../../src/index";

describe("formParseNodeFactory", () => {
	it("formParseNodeFactory", () => {
		const formParseNodeFactory = new FormParseNodeFactory();
		assert.isDefined(formParseNodeFactory);
	});
	it("formParseNodeFactory:getsWriterForFormContentType", () => {
		const factory = new FormParseNodeFactory();

		const expectedForm = "subject=subject-value";
		const sampleArrayBuffer = new TextEncoder().encode(expectedForm);

		const formParseNode = factory.getRootParseNode(factory.getValidContentType(), sampleArrayBuffer);
		assert.isDefined(formParseNode);
	});
	it("formParseNodeFactory:throwsForInvalidContentType", () => {
		const factory = new FormParseNodeFactory();

		const expectedForm = "subject=subject-value";
		const sampleArrayBuffer = new TextEncoder().encode(expectedForm);

		assert.throw(() => factory.getRootParseNode("application/json", sampleArrayBuffer));
	});
	it("formParseNodeFactory:throwsForNoContentType", () => {
		const factory = new FormParseNodeFactory();

		assert.throw(() => {
			const sampleArrayBuffer = new TextEncoder().encode("foo");
			factory.getRootParseNode("", sampleArrayBuffer);
		});
		assert.throw(() => {
			const sampleArrayBuffer = new TextEncoder().encode("foo");
			factory.getRootParseNode(undefined as unknown as string, sampleArrayBuffer);
		});
	});
});
