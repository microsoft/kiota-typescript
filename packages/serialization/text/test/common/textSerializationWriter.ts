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
});

export const LongRunningOperationStatusObject = {
	NotStarted: "notStarted",
	Running: "running",
	Succeeded: "succeeded",
	Failed: "failed",
	UnknownFutureValue: "unknownFutureValue",
} as const;
