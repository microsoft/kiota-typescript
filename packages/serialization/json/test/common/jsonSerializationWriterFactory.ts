/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { JsonSerializationWriterFactory } from "../../src/index";

describe("jsonSerializationWriterFactory", () => {
	it("jsonSerializationWriterFactory", () => {
		const factory = new JsonSerializationWriterFactory();
		assert.isDefined(factory);
	});
	it("jsonSerializationWriterFactory:getsWriterForJsonContentType", () => {
		const factory = new JsonSerializationWriterFactory();

		const jsonWriter = factory.getSerializationWriter(factory.getValidContentType());
		assert.isDefined(jsonWriter);
	});
	it("jsonSerializationWriterFactory:throwsForInvalidContentType", () => {
		const factory = new JsonSerializationWriterFactory();

		assert.throw(() => factory.getSerializationWriter("text/plain"));
	});
	it("jsonSerializationWriterFactory:throwsForNoContentType", () => {
		const factory = new JsonSerializationWriterFactory();

		assert.throw(() => factory.getSerializationWriter(""));
		assert.throw(() => factory.getSerializationWriter(undefined as unknown as string));
	});
	it("jsonSerializationWriterFactory:getsWriterForJsonContentTypeWithParameters", () => {
		const factory = new JsonSerializationWriterFactory();

		assert.isDefined(factory.getSerializationWriter("application/json; charset=utf-8"));
		assert.isDefined(factory.getSerializationWriter("APPLICATION/JSON"));
		assert.isDefined(factory.getSerializationWriter(" application/json ; charset=UTF-8 "));
		assert.isDefined(factory.getSerializationWriter("application/json;odata.metadata=minimal"));
	});
});
