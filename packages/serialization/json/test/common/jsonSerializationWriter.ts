import { assert } from "chai";

import { JsonParseNode, JsonSerializationWriter } from "../../src/index";
import {
  createTestParserFromDiscriminatorValue,
  serializeTestParser,
  type TestParser,
} from "./testEntity";
import { UntypedTestEntity, serializeUntypedTestEntity } from "./untypedTestEntiy";
import { UntypedArray, UntypedBoolean, UntypedNull, UntypedNumber, UntypedObject, UntypedString, createUntypedArray, createUntypedBoolean, createUntypedNull, createUntypedNumber, createUntypedObject, createUntypedString } from "@microsoft/kiota-abstractions";

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
  it("serializes untyped nodes as expected", async () => {
    const inputObject: UntypedTestEntity = {
      id: "1",
      title: "title",
      location: createUntypedObject({
        address: createUntypedObject({
          city: createUntypedString("Redmond"),
          postalCode: createUntypedString("98052"),
          state: createUntypedString("Washington"),
          street: createUntypedString("NE 36th St"),
        }),
        coordinates: createUntypedObject({
          latitude: createUntypedNumber(47.678581),
          longitude: createUntypedNumber(-122.131577),
        }),
        displayName: createUntypedString("Microsoft Building 25"),
        floorCount: createUntypedNumber(50),
        hasReception: createUntypedBoolean(true),
        contact: createUntypedNull(),
      }),
      keywords: createUntypedArray([
        createUntypedObject({
          created: createUntypedString("2023-07-26T10:41:26Z"),
          label: createUntypedString("Keyword1"),
          termGuid: createUntypedString("10e9cc83-b5a4-4c8d-8dab-4ada1252dd70"),
          wssId: createUntypedNumber(6442450941),
        }),
        createUntypedObject({
          created: createUntypedString("2023-07-26T10:51:26Z"),
          label: createUntypedString("Keyword2"),
          termGuid: createUntypedString("2cae6c6a-9bb8-4a78-afff-81b88e735fef"),
          wssId: createUntypedNumber(6442450942),
        }),
      ]),
      additionalData: {
        extra: createUntypedObject({
          createdDateTime: createUntypedString("2024-01-15T00:00:00+00:00"),
        }),
      },
    };
    const writer = new JsonSerializationWriter();
    writer.writeObjectValue("", inputObject, serializeUntypedTestEntity);
    const serializedContent = writer.getSerializedContent();
    const decoder = new TextDecoder();
    const contentAsStr = decoder.decode(serializedContent);
    assert.equal(
      '{"id":"1","title":"title","location":{"address":{"city":"Redmond","postalCode":"98052","state":"Washington","street":"NE 36th St"},"coordinates":{"latitude":47.678581,"longitude":-122.131577},"displayName":"Microsoft Building 25","floorCount":50,"hasReception":true,"contact":null},"keywords":[{"created":"2023-07-26T10:41:26Z","label":"Keyword1","termGuid":"10e9cc83-b5a4-4c8d-8dab-4ada1252dd70","wssId":6442450941},{"created":"2023-07-26T10:51:26Z","label":"Keyword2","termGuid":"2cae6c6a-9bb8-4a78-afff-81b88e735fef","wssId":6442450942}],"extra":{"value":{"createdDateTime":{"value":"2024-01-15T00:00:00+00:00"}}}}',
      contentAsStr,
    );
  });
});
