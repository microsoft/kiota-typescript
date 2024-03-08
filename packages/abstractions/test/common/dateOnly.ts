import { assert, describe, it } from "vitest";

import { DateOnly } from "../../src/dateOnly";

describe("DateOnly", () => {
  it("parses date only", () => {
    const result = DateOnly.parse("2017-09-04");
    assert.equal(result?.year, 2017);
    assert.equal(result?.month, 9);
    assert.equal(result?.day, 4);
  });
});
