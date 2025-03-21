/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { FormParseNodeFactory } from "../../src/index";
import { BackingStoreFactory, InMemoryBackingStoreFactory } from "@microsoft/kiota-abstractions";

describe("formParseNodeFactory", () => {
	const backingStoreFactory: BackingStoreFactory = new InMemoryBackingStoreFactory();

	it("formParseNodeFactory", () => {
		const formParseNodeFactory = new FormParseNodeFactory(backingStoreFactory);
		assert.isDefined(formParseNodeFactory);
	});
	it("formParseNodeFactory:getsWriterForFormContentType", () => {
		const factory = new FormParseNodeFactory(backingStoreFactory);

		const expectedForm = "subject=subject-value";
		const sampleArrayBuffer = new TextEncoder().encode(expectedForm);

		const formParseNode = factory.getRootParseNode(factory.getValidContentType(), sampleArrayBuffer);
		assert.isDefined(formParseNode);
	});
	it("formParseNodeFactory:throwsForInvalidContentType", () => {
		const factory = new FormParseNodeFactory(backingStoreFactory);

		const expectedForm = "subject=subject-value";
		const sampleArrayBuffer = new TextEncoder().encode(expectedForm);

		assert.throw(() => factory.getRootParseNode("application/json", sampleArrayBuffer));
	});
	it("formParseNodeFactory:throwsForNoContentType", () => {
		const factory = new FormParseNodeFactory(backingStoreFactory);

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
