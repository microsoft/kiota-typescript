import { assert, describe, it } from "vitest";

import { TextParseNodeFactory } from "../../src/index";

describe("textParseNodeFactory", () => {
	it("textParseNodeFactory", async () => {
		const textParseNodeFactory = new TextParseNodeFactory();
		assert.isDefined(textParseNodeFactory);
	});
	it("textParseNodeFactory:convertArrayBufferToText should convert an array to text", async () => {
		const textParseNodeFactory = new TextParseNodeFactory();

		const expectedText = "hello serializer";
		const sampleArrayBuffer = new TextEncoder().encode(expectedText);

		const outputText = textParseNodeFactory["convertArrayBufferToText"](sampleArrayBuffer);

		assert.equal(outputText, expectedText);
	});
});
