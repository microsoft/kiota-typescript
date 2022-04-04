/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert } from "chai";
import { URL } from "url";

import { RequestInformation } from "../../src";

describe("RequestInformation", () => {
  it("Should set request information uri", () => {
    const baseUrl = "https://graph.microsoft.com/v1.0";

    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "{+baseurl}/users";
    assert.isNotNull(URL);
    assert.equal(
      requestInformation.URL,
      "https://graph.microsoft.com/v1.0/users"
    );
  });
});
