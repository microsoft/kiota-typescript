import { ParseNode, SerializationWriter } from "@microsoft/kiota-abstractions";
import { assert } from "chai";

import { JsonParseNode } from "../../src/index";

describe("JsonParseNode", () => {
  it("jsonParseNode:initializes", async () => {
    const jsonParseNode = new JsonParseNode(null);
    assert.isDefined(jsonParseNode);
  });
  it("jsonParseNode:initializes", async () => {
    interface TestParser {
      testCollection?: string[] | undefined;
    }

    function deserializeTestParser(
      testParser: TestParser | undefined = {}
    ): Record<string, (node: ParseNode) => void> {
      return {
        testCollection: (n) => {
          testParser.testCollection = n.getCollectionOfPrimitiveValues();
        },
      };
    }

    const result = new JsonParseNode(null).getObjectValue(
      deserializeTestParser
    );
    assert.isDefined(result);

    const stringValueResult = new JsonParseNode({
      testCollection: ["2", "3"],
    }).getObjectValue(deserializeTestParser) as TestParser;
    assert.equal(stringValueResult.testCollection?.length, 2);
    assert.equal(stringValueResult.testCollection?.shift(), "2");
  });
});
