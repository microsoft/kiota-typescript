import {
  Parsable,
  ParseNode,
  SerializationWriter,
} from "@microsoft/kiota-abstractions";
import { assert } from "chai";

import { JsonParseNode } from "../../src/index";

describe("JsonParseNode", () => {
  it("jsonParseNode:initializes", async () => {
    const jsonParseNode = new JsonParseNode(null);
    assert.isDefined(jsonParseNode);
  });
  it("jsonParseNode:initializes", async () => {
    class TestParser implements Parsable {
      private _testCollection?: string[] | undefined;

      public get testCollection() {
        return this._testCollection;
      }

      public set testCollection(value: string[] | undefined) {
        this._testCollection = value;
      }

      getFieldDeserializers(): Record<string, (node: ParseNode) => void> {
        return {
          testCollection: (n) => {
            this.testCollection = n.getCollectionOfPrimitiveValues<string>();
          },
        };
      }
      serialize(writer: SerializationWriter): void {
        if (!writer) throw new Error("writer cannot be undefined");
        writer.writeCollectionOfPrimitiveValues<string>(
          "testCollection",
          this.testCollection
        );
      }
    }

    function factory(parseNode: ParseNode | undefined): TestParser {
      if (!parseNode) throw new Error("parseNode cannot be undefined");
      return new TestParser();
    }

    const result = new JsonParseNode(null).getObjectValue(factory);
    assert.isDefined(result);

    const stringValueResult = new JsonParseNode({
      testCollection: ["2", "3"],
    }).getObjectValue(factory);
    assert.equal(stringValueResult.testCollection?.length, 2);
    assert.equal(stringValueResult.testCollection?.shift(), "2");
  });
});
