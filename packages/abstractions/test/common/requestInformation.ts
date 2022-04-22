/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import * as chai from "chai";
import { URL } from "url";

const assert = chai.assert;

import { RequestInformation } from "../../src";

class GetQueryParameters {
  select?: string[];
  count?: boolean;
  filter?: string;
  orderby?: string[];
  search?: string;
  getQueryParameter(originalName: string): string {
    switch (originalName.toLowerCase()) {
      case 'select': return '%24select';
      case 'count': return '%24count';
      case 'filter': return '%24filter';
      case 'orderby': return '%24orderby';
      case 'search': return '%24search';
      default: return originalName;
    }
  }
}

describe("RequestInformation", () => {
  const baseUrl = "https://graph.microsoft.com/v1.0";
  it("Should set request information uri", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "{+baseurl}/users";
    assert.isNotNull(URL);
    assert.equal(
      requestInformation.URL,
      "https://graph.microsoft.com/v1.0/users"
    );
  });

  it("Sets select query parameter", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "http://localhost/me{?%24select}";
    const qs = new GetQueryParameters();
    qs.select = ["id", "displayName"];
    requestInformation.setQueryStringParametersFromRawObject(qs);
    assert.equal(requestInformation.URL,
      "http://localhost/me?%24select=id,displayName");
  });

  it("Adds headers to requestInformation", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "http://localhost/me{?%24select}";
    const headers: Record<string, string> = { ConsistencyLevel: "eventual" };
    requestInformation.addRequestHeaders(headers);
    assert.isNotEmpty(requestInformation.headers);
    assert.equal("eventual", requestInformation.headers["ConsistencyLevel"]);
  });
});
