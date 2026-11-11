import { DateOnly, Duration, TimeOnly } from "@microsoft/kiota-abstractions";
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
	it("writeNumberValue serializes zero, negative, positive and null values", () => {
		const zeroWriter = new TextSerializationWriter();
		zeroWriter.writeNumberValue(undefined, 0);
		const zeroContent = new TextDecoder().decode(zeroWriter.getSerializedContent());
		assert.equal(zeroContent, "0");

		const negativeWriter = new TextSerializationWriter();
		negativeWriter.writeNumberValue("", -42);
		const negativeContent = new TextDecoder().decode(negativeWriter.getSerializedContent());
		assert.equal(negativeContent, "-42");

		const positiveWriter = new TextSerializationWriter();
		positiveWriter.writeNumberValue(undefined, 100);
		const positiveContent = new TextDecoder().decode(positiveWriter.getSerializedContent());
		assert.equal(positiveContent, "100");

		const nullWriter = new TextSerializationWriter();
		nullWriter.writeNumberValue(undefined, null);
		const nullContent = new TextDecoder().decode(nullWriter.getSerializedContent());
		assert.equal(nullContent, "null");

		const undefinedWriter = new TextSerializationWriter();
		undefinedWriter.writeNumberValue(undefined, undefined);
		const undefinedContent = new TextDecoder().decode(undefinedWriter.getSerializedContent());
		assert.equal(undefinedContent, "");
	});
	it("writeBooleanValue and writeByteArrayValue with undefined key", () => {
		const trueWriter = new TextSerializationWriter();
		trueWriter.writeBooleanValue(undefined, true);
		const trueContent = new TextDecoder().decode(trueWriter.getSerializedContent());
		assert.equal(trueContent, "true");

		const falseWriter = new TextSerializationWriter();
		falseWriter.writeBooleanValue(undefined, false);
		const falseContent = new TextDecoder().decode(falseWriter.getSerializedContent());
		assert.equal(falseContent, "false");

		const byteWriter = new TextSerializationWriter();
		const buffer = new TextEncoder().encode("Hello World").buffer;
		byteWriter.writeByteArrayValue(undefined, buffer);
		const byteContent = new TextDecoder().decode(byteWriter.getSerializedContent());
		assert.equal(byteContent, btoa("Hello World"));
	});
	it("writeTemporal, writeGuidValue and writeNullValue with undefined key", () => {
		const dateWriter = new TextSerializationWriter();
		const date = new Date("2026-11-11T00:00:00.000Z");
		dateWriter.writeDateValue(undefined, date);
		const dateContent = new TextDecoder().decode(dateWriter.getSerializedContent());
		assert.equal(dateContent, '"2026-11-11T00:00:00.000Z"');

		const dateOnlyWriter = new TextSerializationWriter();
		dateOnlyWriter.writeDateOnlyValue(undefined, DateOnly.parse("2026-11-11"));
		const dateOnlyContent = new TextDecoder().decode(dateOnlyWriter.getSerializedContent());
		assert.equal(dateOnlyContent, '"2026-11-11"');

		const timeOnlyWriter = new TextSerializationWriter();
		timeOnlyWriter.writeTimeOnlyValue(undefined, TimeOnly.parse("12:30:00"));
		const timeOnlyContent = new TextDecoder().decode(timeOnlyWriter.getSerializedContent());
		assert.equal(timeOnlyContent, '"12:30:00.0000000"');

		const durationWriter = new TextSerializationWriter();
		durationWriter.writeDurationValue(undefined, Duration.parse("PT1H"));
		const durationContent = new TextDecoder().decode(durationWriter.getSerializedContent());
		assert.equal(durationContent, '"PT1H"');

		const guidWriter = new TextSerializationWriter();
		guidWriter.writeGuidValue(undefined, "d3b07384-d113-4632-9c9e-4c4d5d36e014");
		const guidContent = new TextDecoder().decode(guidWriter.getSerializedContent());
		assert.equal(guidContent, '"d3b07384-d113-4632-9c9e-4c4d5d36e014"');

		const nullWriter = new TextSerializationWriter();
		nullWriter.writeNullValue(undefined);
		const nullContent = new TextDecoder().decode(nullWriter.getSerializedContent());
		assert.equal(nullContent, "null");
	});
});

export const LongRunningOperationStatusObject = {
	NotStarted: "notStarted",
	Running: "running",
	Succeeded: "succeeded",
	Failed: "failed",
	UnknownFutureValue: "unknownFutureValue",
} as const;
