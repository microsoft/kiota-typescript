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
	});
	it("multipartSerializationWriterFactory:throwsForNoContentType", () => {
		const factory = new MultipartSerializationWriterFactory();

		assert.throw(() => factory.getSerializationWriter(""));
	});
});
