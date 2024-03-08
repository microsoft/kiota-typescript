import { assert, describe, it } from "vitest";

import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5} from "uuid";

import { parseGuidString } from "../../src/utils/guidUtils";


describe("ParseGuidString", () => {
  it("parses a guid string", () => {
    let result = parseGuidString("");
    assert.isUndefined(result);

    result = parseGuidString(undefined);
    assert.isUndefined(result);

    result = parseGuidString("invalid-guid-string"); // invalid guid string
    assert.isUndefined(result);

    const v1 = uuidv1();
    const v1Guid = parseGuidString(v1);
    assert.isDefined(v1Guid);

    const v4 = uuidv4();
    const v4Guid = parseGuidString(v4);
    assert.isDefined(v4Guid);

    const v5 = uuidv5("example.com", uuidv5.URL);
    const v5Guid = parseGuidString(v5);
    assert.isDefined(v5Guid);
  });
});