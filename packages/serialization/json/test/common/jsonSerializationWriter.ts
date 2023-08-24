import { assert } from "chai";

import { JsonParseNode, JsonSerializationWriter } from "../../src/index";
import {
  createTestParserFromDiscriminatorValue,
  serializeTestParser,
  TestParser,
} from "./testEntity";

describe("JsonParseNode", () => {
  it("Test object serialization", async () => {
    const inputObject: TestParser = {
      testCollection: ["2", "3"],
      testString: "test",
      testComplexString: "A more \"complex\" string with \r\nlinebreaks and 'weird' characters",
      testObject: {
        additionalData: {
          testObjectName: "str",
          testObjectProp: {
            someValue: 123,
          },
        },
      },
    };
    const expectedObject: TestParser = {
      testCollection: ["2", "3"],
      testString: "test",
      testComplexString: "A more \"complex\" string with \r\nlinebreaks and 'weird' characters",
      testObject: {
        testObjectName: "str",
        testObjectProp: {
          someValue: 123,
        },
      },
    };

    const writer = new JsonSerializationWriter();
    writer.writeObjectValue("", inputObject, serializeTestParser);

    const serializedContent = writer.getSerializedContent();

    const decoder = new TextDecoder();
    const contentAsStr = decoder.decode(serializedContent);
    const result = JSON.parse(contentAsStr);
    const stringValueResult = new JsonParseNode(result).getObjectValue(
      createTestParserFromDiscriminatorValue
    ) as TestParser;

    assert.deepEqual(stringValueResult, expectedObject);
  });
});
