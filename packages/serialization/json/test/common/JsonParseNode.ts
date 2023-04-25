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
});
