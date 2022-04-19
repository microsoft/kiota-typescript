import { assert } from "chai";

import { JsonParseNodeFactory } from "../../src/jsonParseNodeFactory";

describe("jsonParseNodeFactory", () => {
  it("jsonParseNodeFactory", async () => {
    const jsonParseNodeFactory = new JsonParseNodeFactory();
    assert.isDefined(jsonParseNodeFactory);
  });
});
