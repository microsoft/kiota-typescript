import { assert } from "chai";

import { JsonParseNode, JsonSerializationWriter } from "../../src/index";
import {
  createTestParserFromDiscriminatorValue,
  serializeTestParser,
  type TestParser,
} from "./testEntity";

describe("JsonParseNode", () => {
  it("Test object serialization", async () => {
    const testDate = new Date();

    const inputObject: TestParser = {
      testCollection: ["2", "3"],
      testString: "test",
      testComplexString:
        "A more \"complex\" string with \r\nlinebreaks and 'weird' characters",
      testObject: {
        additionalData: {
          testObjectName: "str",
          testObjectProp: {
            someValue: 123,
          },
        },
      },
      testDate,
    };
    const expectedObject: TestParser = {
      testCollection: ["2", "3"],
      testString: "test",
      testComplexString:
        "A more \"complex\" string with \r\nlinebreaks and 'weird' characters",
      testObject: {
        testObjectName: "str",
        testObjectProp: {
          someValue: 123,
        },
      },
      testDate,
    };

    const writer = new JsonSerializationWriter();
    writer.writeObjectValue("", inputObject, serializeTestParser);

    const serializedContent = writer.getSerializedContent();

    const decoder = new TextDecoder();
    const contentAsStr = decoder.decode(serializedContent);
    const result = JSON.parse(contentAsStr);
    const stringValueResult = new JsonParseNode(result).getObjectValue(
      createTestParserFromDiscriminatorValue,
    ) as TestParser;

    assert.deepEqual(stringValueResult, expectedObject);
  });
  it("encodes characters properly", async () => {
    const inputObject: TestParser = {
      testCollection: ["2", "3"],
      testString: "test",
      testComplexString: "Błonie",
      testObject: {
        additionalData: {
          testObjectName: "str",
          testObjectProp: {
            someValue: 123,
          },
        },
      },
    };
    const writer = new JsonSerializationWriter();
    writer.writeObjectValue("", inputObject, serializeTestParser);
    const serializedContent = writer.getSerializedContent();
    const decoder = new TextDecoder();
    const contentAsStr = decoder.decode(serializedContent);
    const result = JSON.parse(contentAsStr);
    assert.equal(result.testComplexString, "Błonie");
  });
});
