import { assert, describe, it } from "vitest";
import { TextSerializationWriter, TextSerializationWriterFactory } from "../../src";

describe("TextSerializationWriter", () => {
	it("writeEnumValue", () => {
		const textSerializationWriter = new TextSerializationWriter();

		const statuses = [LongRunningOperationStatusObject.NotStarted, LongRunningOperationStatusObject.Running];
		textSerializationWriter.writeEnumValue("", ...statuses);
		const formContent = textSerializationWriter.getSerializedContent();
		const form = new TextDecoder().decode(formContent);
		const expectedString = "notStarted,running";
		assert.equal(form, expectedString);
	});
	it("writeCollectionOfEnumValues", () => {
		const textSerializationWriter = new TextSerializationWriter();
		const statuses = [LongRunningOperationStatusObject.NotStarted, LongRunningOperationStatusObject.Running];
		textSerializationWriter.writeCollectionOfEnumValues("", statuses);
		const formContent = textSerializationWriter.getSerializedContent();
		const form = new TextDecoder().decode(formContent);
		const expectedString = "notStarted,running";
		assert.equal(form, expectedString);
	});
	it("supports content type with parameters and whitespace in factory", () => {
		const factory = new TextSerializationWriterFactory();
		const writer1 = factory.getSerializationWriter("text/plain; charset=utf-8");
		assert.isDefined(writer1);

		const writer2 = factory.getSerializationWriter("  TEXT/PLAIN; charset=utf-8  ");
		assert.isDefined(writer2);
	});
	it("writeStringValue with undefined and empty keys", () => {
		const writer1 = new TextSerializationWriter();
		writer1.writeStringValue(undefined, "test string");
		const content1 = new TextDecoder().decode(writer1.getSerializedContent());
		assert.equal(content1, "test string");

		const writer2 = new TextSerializationWriter();
		writer2.writeStringValue("", "empty key string");
		const content2 = new TextDecoder().decode(writer2.getSerializedContent());
		assert.equal(content2, "empty key string");

		const writer3 = new TextSerializationWriter();
		assert.throws(() => writer3.writeStringValue("structuredKey", "value"), "text does not support structured data");
	});
});

export const LongRunningOperationStatusObject = {
	NotStarted: "notStarted",
	Running: "running",
	Succeeded: "succeeded",
	Failed: "failed",
	UnknownFutureValue: "unknownFutureValue",
} as const;
