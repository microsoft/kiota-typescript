/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { MultipartSerializationWriterFactory } from "../../src/index";

describe("multipartSerializationWriterFactory", () => {
	it("multipartSerializationWriterFactory", () => {
		const factory = new MultipartSerializationWriterFactory();
		assert.isDefined(factory);
	});
	it("multipartSerializationWriterFactory:getsWriterForMultipartContentType", () => {
		const factory = new MultipartSerializationWriterFactory();

		const multipartParseNode = factory.getSerializationWriter(factory.getValidContentType());
		assert.isDefined(multipartParseNode);
	});
	it("multipartSerializationWriterFactory:throwsForInvalidContentType", () => {
		const factory = new MultipartSerializationWriterFactory();

		assert.throw(() => factory.getSerializationWriter("application/json"));
		assert.throw(() => factory.getSerializationWriter("application/json; charset=utf-8"));
	});
	it("multipartSerializationWriterFactory:throwsForNoContentType", () => {
		const factory = new MultipartSerializationWriterFactory();

		assert.throw(() => factory.getSerializationWriter(""));
	});
	it("multipartSerializationWriterFactory:getsWriterForMultipartContentTypeWithParameters", () => {
		const factory = new MultipartSerializationWriterFactory();

		assert.isDefined(factory.getSerializationWriter("multipart/form-data; boundary=---------------------------974767299852498929531610575"));
		assert.isDefined(factory.getSerializationWriter("multipart/form-data; charset=utf-8"));
		assert.isDefined(factory.getSerializationWriter("MULTIPART/FORM-DATA"));
		assert.isDefined(factory.getSerializationWriter("MULTIPART/FORM-DATA; BOUNDARY=xyz"));
		assert.isDefined(factory.getSerializationWriter(" multipart/form-data ; boundary=abc "));
	});
});
