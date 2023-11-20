/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import * as chai from "chai";
import { URL } from "url";

const assert = chai.assert;

import {
  HttpMethod,
  type Parsable,
  type RequestAdapter,
  RequestInformation,
  type SerializationWriter,
  type SerializationWriterFactory,
  Headers,
} from "../../src";
import { MultipartBody } from "../../src/multipartBody";

interface GetQueryParameters {
  select?: string[];
  count?: boolean;
  filter?: string;
  orderby?: string[];
  search?: string;
}

const getQueryParameterMapper: Record<string, string> = {
  select: "%24select",
  count: "%24count",
  filter: "%24filter",
  orderby: "%24orderby",
  search: "%24search",
};

describe("RequestInformation", () => {
  const baseUrl = "https://graph.microsoft.com/v1.0";
  it("Should set request information uri", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "{+baseurl}/users";
    assert.isNotNull(URL);
    assert.equal(
      requestInformation.URL,
      "https://graph.microsoft.com/v1.0/users",
    );
  });

  it("Should conserve parameters casing", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["BaseUrl"] = baseUrl;
    requestInformation.urlTemplate = "{+BaseUrl}/users";
    assert.isNotNull(URL);
    assert.equal(
      requestInformation.URL,
      "https://graph.microsoft.com/v1.0/users",
    );
  });

  it("Sets select query parameter", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "http://localhost/me{?%24select}";
    requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>(
      { select: ["id", "displayName"] },
      getQueryParameterMapper,
    );
    assert.equal(
      requestInformation.URL,
      "http://localhost/me?%24select=id,displayName",
    );
  });

  it("Does not set empty select query parameter", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "http://localhost/me{?%24select}";
    requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>(
      { select: [] },
      getQueryParameterMapper,
    );
    assert.equal(requestInformation.URL, "http://localhost/me");
  });

  it("Does not set empty search query parameter", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "http://localhost/me{?%24select}";
    requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>(
      { search: "" },
      getQueryParameterMapper,
    );
    assert.equal(requestInformation.URL, "http://localhost/me");
  });

  it("Adds headers to requestInformation", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "http://localhost/me{?%24select}";
    const headers = new Headers();
    headers.add("ConsistencyLevel", "eventual"); 
    requestInformation.addRequestHeaders(headers);
    assert.isTrue(requestInformation.headers.has("ConsistencyLevel"));
    assert.equal(requestInformation.headers.tryGetValue("ConsistencyLevel")![0], "eventual");
  });

  it("Try to add headers to requestInformation", () => {
    const requestInformation = new RequestInformation();
    requestInformation.pathParameters["baseurl"] = baseUrl;
    requestInformation.urlTemplate = "http://localhost/me{?%24select}";
    assert.isTrue(requestInformation.tryAddRequestHeaders("key", "value1"));
    assert.equal(Array.from(requestInformation.headers.keys()).length, 1);
    assert.equal(requestInformation.headers.tryGetValue("key")!.length, 1);
    assert.equal(requestInformation.headers.tryGetValue("key")![0], "value1");
    assert.isTrue(requestInformation.tryAddRequestHeaders("key", "value2"));
    assert.equal(Array.from(requestInformation.headers.keys()).length, 1);
    assert.equal(requestInformation.headers.tryGetValue("key")!.length, 2);
    assert.equal(requestInformation.headers.tryGetValue("key")![0], "value1");
    assert.equal(requestInformation.headers.tryGetValue("key")![1], "value2");
  });

  it("Sets a parsable content", () => {
    const requestInformation = new RequestInformation();
    let methodCalledCount = 0;
    const mockRequestAdapter = {
      getSerializationWriterFactory: () => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getSerializationWriter: (_: string) => {
            return {
              writeObjectValue: <T extends Parsable>(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                key?: string | undefined,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                value?: T | undefined,
              ) => {
                methodCalledCount++;
              },
              getSerializedContent: () => {
                return new ArrayBuffer(0);
              },
            } as unknown as SerializationWriter;
          },
        } as SerializationWriterFactory;
      },
    } as RequestAdapter;
    requestInformation.setContentFromParsable(
      mockRequestAdapter,
      "application/json",
      {} as unknown as Parsable,
    );
    const headers = new Headers();
    headers.add("ConsistencyLevel", "eventual"); 
    requestInformation.addRequestHeaders(headers);
    //assert.isNotEmpty(requestInformation.headers.entries());
    assert.equal(methodCalledCount, 1);
  });

  it("Sets a parsable collection content", () => {
    const requestInformation = new RequestInformation();
    let methodCalledCount = 0;
    const mockRequestAdapter = {
      getSerializationWriterFactory: () => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getSerializationWriter: (_: string) => {
            return {
              writeCollectionOfObjectValues: <T extends Parsable>(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                key?: string | undefined,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                values?: T[],
              ) => {
                methodCalledCount++;
              },
              getSerializedContent: () => {
                return new ArrayBuffer(0);
              },
            } as unknown as SerializationWriter;
          },
        } as SerializationWriterFactory;
      },
    } as RequestAdapter;
    requestInformation.setContentFromParsable(
      mockRequestAdapter,
      "application/json",
      [{} as unknown as Parsable],
    );
    const headers = new Headers();
    headers.add("ConsistencyLevel", "eventual"); 
    requestInformation.addRequestHeaders(headers);
    assert.equal(methodCalledCount, 1);
  });

  it("Sets a scalar content", () => {
    const requestInformation = new RequestInformation();
    let writtenValue = "";
    const mockRequestAdapter = {
      getSerializationWriterFactory: () => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getSerializationWriter: (_: string) => {
            return {
              writeStringValue: (
                key?: string | undefined,
                value?: string | undefined,
              ) => {
                writtenValue = value as unknown as string;
              },
              getSerializedContent: () => {
                return new ArrayBuffer(0);
              },
            } as unknown as SerializationWriter;
          },
        } as SerializationWriterFactory;
      },
    } as RequestAdapter;
    requestInformation.setContentFromScalar(
      mockRequestAdapter,
      "application/json",
      "some content",
    );
    const headers = new Headers();
    headers.add("ConsistencyLevel", "eventual"); 
    requestInformation.addRequestHeaders(headers);
    assert.equal(writtenValue, "some content");
  });

  it("Sets a scalar collection content", () => {
    const requestInformation = new RequestInformation();
    let writtenValue = "";
    const mockRequestAdapter = {
      getSerializationWriterFactory: () => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getSerializationWriter: (_: string) => {
            return {
              writeCollectionOfPrimitiveValues: <T>(
                key?: string | undefined,
                values?: T[] | undefined,
              ) => {
                writtenValue = JSON.stringify(values);
              },
              getSerializedContent: () => {
                return new ArrayBuffer(0);
              },
            } as unknown as SerializationWriter;
          },
        } as SerializationWriterFactory;
      },
    } as RequestAdapter;
    requestInformation.setContentFromScalar(
      mockRequestAdapter,
      "application/json",
      ["some content"],
    );
    const headers = new Headers();
    headers.add("ConsistencyLevel", "eventual"); 
    requestInformation.addRequestHeaders(headers);
    assert.equal(writtenValue, '["some content"]');
  });

  it("Sets the boundary on multipart content", () => {
    const requestInformation = new RequestInformation();
    requestInformation.urlTemplate =
      "http://localhost/{URITemplate}/ParameterMapping?IsCaseSensitive={IsCaseSensitive}";
    requestInformation.httpMethod = HttpMethod.POST;
    const mpBody = new MultipartBody();
    const mockRequestAdapter = {
      getSerializationWriterFactory: () => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          getSerializationWriter: (_: string) => {
            return {
              writeObjectValue: <T>(
                key?: string | undefined,
                value?: T | undefined,
              ) => {
                if (key === "value") {
                  mpBody.addOrReplacePart("1", "application/json", value);
                }
              },
              getSerializedContent: () => {
                return new ArrayBuffer(0);
              },
            } as unknown as SerializationWriter;
          },
        } as SerializationWriterFactory;
      },
    } as RequestAdapter;
    requestInformation.setContentFromParsable(
      mockRequestAdapter,
      "multipart/form-data",
      mpBody,
    );
    const contentTypeHeaderValue =
      requestInformation.headers.tryGetValue("Content-Type")![0];
    assert.equal(
      contentTypeHeaderValue,
      `multipart/form-data; boundary=${mpBody.getBoundary()}`,
    );
    assert.isNotEmpty(mpBody.getBoundary());
  });
});
