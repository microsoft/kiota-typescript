import { assert, describe, it } from "vitest";
import { TextSerializationWriter } from "../../src";

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
});

export const LongRunningOperationStatusObject = {
	NotStarted: "notStarted",
	Running: "running",
	Succeeded: "succeeded",
	Failed: "failed",
	UnknownFutureValue: "unknownFutureValue",
} as const;
