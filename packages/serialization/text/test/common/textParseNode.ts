import { assert } from "chai";

import { TextParseNode } from "../../src/index";

describe("textParseNode", () => {
  it("textParseNode", async () => {
    const textParseNode = new TextParseNode("Test");
    assert.isDefined(textParseNode);
  });
});
