/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { FormSerializationWriterFactory } from "../../src/index";

describe("formSerializationWriterFactory", () => {
	it("formSerializationWriterFactory", () => {
		const factory = new FormSerializationWriterFactory();
		assert.isDefined(factory);
	});
	it("formSerializationWriterFactory:getsWriterForFormContentType", () => {
		const factory = new FormSerializationWriterFactory();

		const formParseNode = factory.getSerializationWriter(factory.getValidContentType());
		assert.isDefined(formParseNode);
	});
	it("formSerializationWriterFactory:throwsForInvalidContentType", () => {
		const factory = new FormSerializationWriterFactory();

		assert.throw(() => factory.getSerializationWriter("application/json"));
	});
	it("formSerializationWriterFactory:throwsForNoContentType", () => {
		const factory = new FormSerializationWriterFactory();

		assert.throw(() => factory.getSerializationWriter(""));
	});
	it("formSerializationWriterFactory:getsWriterForFormContentTypeWithParameters", () => {
		const factory = new FormSerializationWriterFactory();

		assert.isDefined(factory.getSerializationWriter("application/x-www-form-urlencoded; charset=utf-8"));
		assert.isDefined(factory.getSerializationWriter("APPLICATION/X-WWW-FORM-URLENCODED"));
		assert.isDefined(factory.getSerializationWriter(" application/x-www-form-urlencoded ; charset=UTF-8 "));
	});
});
