/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import {
  ApiKeyAuthenticationProvider,
  ApiKeyLocation,
} from "../../../src/authentication";
import { RequestInformation } from "../../../src/requestInformation";

describe("ApiKeyAuthenticationProvider", () => {
  it("Throws on invalid initialization", () => {
    assert.throws(
      () =>
        new ApiKeyAuthenticationProvider(
          "",
          "param",
          ApiKeyLocation.QueryParameter
        )
    );
    assert.throws(
      () =>
        new ApiKeyAuthenticationProvider(
          "param",
          "",
          ApiKeyLocation.QueryParameter
        )
    );
    assert.throws(
      () =>
        new ApiKeyAuthenticationProvider(
          "param",
          "key",
          2 as unknown as ApiKeyLocation
        )
    );
  });
  it("Adds in query parameters", async () => {
    const provider = new ApiKeyAuthenticationProvider(
      "key",
      "param",
      ApiKeyLocation.QueryParameter
    );
    const request = new RequestInformation();
    request.urlTemplate = "https://localhost{?param1}";
    await provider.authenticateRequest(request);
    assert.equal(request.URL, "https://localhost?param=key");
    assert.isNull(request.headers.tryGetValue("param"));
  });
  it("Adds in query parameters with other parameters", async () => {
    const provider = new ApiKeyAuthenticationProvider(
      "key",
      "param",
      ApiKeyLocation.QueryParameter
    );
    const request = new RequestInformation();
    request.urlTemplate = "https://localhost{?param1}";
    request.queryParameters["param1"] = "value1";
    await provider.authenticateRequest(request);
    assert.equal(request.URL, "https://localhost?param1=value1&param=key");
    assert.isNull(request.headers.tryGetValue("param"));
  });
  it("Adds in headers", async () => {
    const provider = new ApiKeyAuthenticationProvider(
      "key",
      "param",
      ApiKeyLocation.Header
    );
    const request = new RequestInformation();
    request.urlTemplate = "https://localhost{?param1}";
    await provider.authenticateRequest(request);
    assert.equal(request.URL, "https://localhost");
    assert.equal(request.headers.tryGetValue("param")![0], "key");
  });
});
