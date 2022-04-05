import { assert } from "chai";

import { TextParseNode } from "../../src/textParseNode";

describe("jsonParseNodeFactory", () => {
  it("jsonParseNodeFactory", async () => {
    const jsonParseNodeFactory = new TextParseNode("Test");
    assert.isDefined(jsonParseNodeFactory);
  });
});
