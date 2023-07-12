import { assert } from "chai";

import { JsonParseNode } from "../../src/index";
import {
  createTestParserFromDiscriminatorValue,
  TestParser,
} from "./testEntity";

describe("JsonParseNode", () => {
  it("jsonParseNode:initializes", async () => {
    const jsonParseNode = new JsonParseNode(null);
    assert.isDefined(jsonParseNode);
  });

  it("Test object creation", async () => {
    const result = new JsonParseNode(null).getObjectValue(
      createTestParserFromDiscriminatorValue
    );
    assert.isDefined(result);

    const stringValueResult = new JsonParseNode({
      testCollection: ["2", "3"],
      testString: "test",
      additionalProperty: "addnProp",
    }).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
    assert.equal(stringValueResult.testCollection?.length, 2);
    assert.equal(stringValueResult.testCollection?.shift(), "2");
  });

  it("Test enum values", async () => {
    enum TestEnum {
      A = "a",
      B = "b",
      C = "c"
    }

    const result = new JsonParseNode([
      "a",
      "b",
      "c"
    ]).getCollectionOfEnumValues(TestEnum) as TestEnum[];
    assert.equal(result.length, 3);
    assert.equal(result.shift(), "a");

    const enumValuesResult = new JsonParseNode([
      "d",
      "b",
      "c"
    ]).getCollectionOfEnumValues(TestEnum) as TestEnum[];
    assert.equal(enumValuesResult.length, 2);
    assert.equal(enumValuesResult.shift(), "b");
  });
});
