import { assert } from "chai";

import { toFirstCharacterUpper } from "../../src/utils";


describe("ToFirstCharacterUpper", () => {
  it("converts the first character to uppercase", () => {
    const undefinedString = toFirstCharacterUpper(undefined);
    assert.equal(undefinedString, "");

    const emptyString = toFirstCharacterUpper("");
    assert.equal(emptyString, "");

    const dummyString = toFirstCharacterUpper("dummyString");
    assert.equal(dummyString, "DummyString");

    const _underscoreString = toFirstCharacterUpper("_underscoreString");
    assert.equal(_underscoreString, "_underscoreString");
  });
});