import { assert } from "chai";

import { TextParseNodeFactory } from "../../src/textParseNodeFactory";

describe("textParseNodeFactory", () => {
  it("textParseNodeFactory", async () => {
    const textParseNodeFactory = new TextParseNodeFactory();
    assert.isDefined(textParseNodeFactory);
  });
  it("textParseNodeFactory:convertArrayBufferToText should convert an array to text", async () => {
    const textParseNodeFactory = new TextParseNodeFactory();

    const expectedText = "hello serializer";
    const sampleArray = new TextEncoder().encode(expectedText);

    const outputText =
      textParseNodeFactory["convertArrayBufferToText"](sampleArray);

    assert.equal(outputText, expectedText);
  });
});
