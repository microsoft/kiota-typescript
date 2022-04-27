import { assert } from "chai";

import { JsonParseNodeFactory } from "../../src/jsonParseNodeFactory";

describe("jsonParseNodeFactory", () => {
  it("jsonParseNodeFactory", async () => {
    const jsonParseNodeFactory = new JsonParseNodeFactory();
    assert.isDefined(jsonParseNodeFactory);
  });
  it("jsonParseNodeFactory:convertArrayBufferToJson should convert an array to json", async () => {
    
    const jsonParseNodeFactory = new JsonParseNodeFactory();

    const expectedJson = '{ "subject": "subject-value" }';
    const sampleArray = new TextEncoder().encode(expectedJson);

    const outputJson =
      jsonParseNodeFactory["convertArrayBufferToJson"](sampleArray);

    assert.equal(outputJson.subject, JSON.parse(expectedJson).subject);
  });
});
