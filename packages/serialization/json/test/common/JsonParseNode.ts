import { ParseNode } from "@microsoft/kiota-abstractions";
import { assert } from "chai";

import { JsonParseNode } from "../../src/index";

describe("JsonParseNode", () => {
  it("jsonParseNode:initializes", async () => {
    const jsonParseNode = new JsonParseNode(null);
    assert.isDefined(jsonParseNode);
  });

  it("Test object creation", async () => {
    interface TestParser {
      testCollection?: string[] | undefined;
      testString?: string | undefined;
    }

    function createTestParserFromDiscriminatorValue(
      parseNode: ParseNode | undefined
    ) {
      if (!parseNode) throw new Error("parseNode cannot be undefined");
      return deserializeTestParser;
    }

    function deserializeTestParser(
      testParser: TestParser | undefined = {}
    ): Record<string, (node: ParseNode) => void> {
      return {
        testCollection: (n) => {
          testParser.testCollection = n.getCollectionOfPrimitiveValues();
        },
        testString: (n) => {
          testParser.testString = n.getStringValue();
        },
      };
    }

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
