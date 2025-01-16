/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { AnonymousAuthenticationProvider, HttpMethod, RequestInformation, type RequestOption } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { FetchRequestAdapter } from "../../src/fetchRequestAdapter";
import { HttpClient } from "../../src/httpClient";
import { getResponse } from "../testUtils";
import { createMockEntityFromDiscriminatorValue } from "./mockEntity";
import { MockParseNode, MockParseNodeFactory } from "./mockParseNodeFactory";
import { JsonParseNode, JsonParseNodeFactory } from "@microsoft/kiota-serialization-json";
import { TextParseNodeFactory } from "@microsoft/kiota-serialization-text";
import { FormParseNodeFactory } from "@microsoft/kiota-serialization-form";

// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}

const TestEnumObject = {
	A: "a",
	B: "b",
	C: "c",
} as const;

type TestEnum = (typeof TestEnumObject)[keyof typeof TestEnumObject];

describe("FetchRequestAdapter.ts", () => {
	describe("getClaimsFromResponse", () => {
		it("should get claims from response header", async () => {
			const mockHttpClient = new HttpClient();
			let executeFetchCount = 0;
			mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
				let response = new Response(null, {
					status: 204,
				} as ResponseInit);
				if (executeFetchCount === 0) {
					response = new Response("", {
						status: 401,
					} as ResponseInit);
					response.headers.set("WWW-authenticate", 'Bearer realm="", authorization_uri="https://login.microsoftonline.com/common/oauth2/authorize", client_id="00000003-0000-0000-c000-000000000000", error="insufficient_claims", claims="eyJhY2Nlc3NfdG9rZW4iOnsibmJmIjp7ImVzc2VudGlhbCI6dHJ1ZSwgInZhbHVlIjoiMTY1MjgxMzUwOCJ9fX0="');
				}
				executeFetchCount++;
				return Promise.resolve(response);
			};
			const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), undefined, undefined, mockHttpClient);
			const requestInformation = new RequestInformation();
			requestInformation.URL = "https://www.example.com";
			requestInformation.httpMethod = HttpMethod.GET;
			await requestAdapter.sendNoResponseContent(requestInformation, undefined);
			assert.equal(executeFetchCount, 2);
		});
	});
	describe("send stream returns stream", () => {
		for (const statusCode of [200, 201, 202, 203, 206]) {
			it(`should return stream for status code ${statusCode}`, async () => {
				const mockHttpClient = new HttpClient();
				mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
					const response = new Response("", {
						status: statusCode,
					} as ResponseInit);
					return Promise.resolve(response);
				};
				const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), undefined, undefined, mockHttpClient);
				const requestInformation = new RequestInformation();
				requestInformation.URL = "https://www.example.com";
				requestInformation.httpMethod = HttpMethod.GET;
				const result = await requestAdapter.sendPrimitive(requestInformation, "ArrayBuffer", undefined);
				assert.isDefined(result);
			});
		}
	});
	describe("send stream returns null on no content", () => {
		for (const statusCode of [200, 201, 202, 203, 204]) {
			it(`should return null for status code ${statusCode}`, async () => {
				const mockHttpClient = new HttpClient();
				mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
					const response = new Response(null, {
						status: statusCode,
					} as ResponseInit);
					return Promise.resolve(response);
				};
				const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), undefined, undefined, mockHttpClient);
				const requestInformation = new RequestInformation();
				requestInformation.URL = "https://www.example.com";
				requestInformation.httpMethod = HttpMethod.GET;
				const result = await requestAdapter.sendPrimitive(requestInformation, "ArrayBuffer", undefined);
				assert.isUndefined(result);
			});
		}
	});
	describe("send returns null on no content", () => {
		for (const statusCode of [200, 201, 202, 203, 204, 205]) {
			it(`should return null for status code ${statusCode}`, async () => {
				const mockHttpClient = new HttpClient();
				mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
					const response = new Response(null, {
						status: statusCode,
					} as ResponseInit);
					return Promise.resolve(response);
				};
				const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), undefined, undefined, mockHttpClient);
				const requestInformation = new RequestInformation();
				requestInformation.URL = "https://www.example.com";
				requestInformation.httpMethod = HttpMethod.GET;
				const result = await requestAdapter.send(requestInformation, createMockEntityFromDiscriminatorValue, undefined);
				assert.isUndefined(result);
			});
		}
	});
	describe("send returns object on content", () => {
		for (const statusCode of [200, 201, 202, 203]) {
			it(`should return object for status code ${statusCode}`, async () => {
				const mockHttpClient = new HttpClient();
				mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
					const response = new Response("test", {
						status: statusCode,
					} as ResponseInit);
					response.headers.set("Content-Type", "application/json");
					return Promise.resolve(response);
				};
				const mockFactory = new MockParseNodeFactory(new MockParseNode({}));
				const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), mockFactory, undefined, mockHttpClient);
				const requestInformation = new RequestInformation();
				requestInformation.URL = "https://www.example.com";
				requestInformation.httpMethod = HttpMethod.GET;
				const result = await requestAdapter.send(requestInformation, createMockEntityFromDiscriminatorValue, undefined);
				assert.isDefined(result);
			});
		}
	});
	describe("send enum", () => {
		for (const statusCode of [200, 201, 202, 203]) {
			const enumResponse = "a";
			it(`should return object for status code ${statusCode}`, async () => {
				const mockHttpClient = new HttpClient();
				mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
					const response = new Response(enumResponse, {
						status: statusCode,
					} as ResponseInit);
					response.headers.set("Content-Type", "text/plain");
					return Promise.resolve(response);
				};
				const mockFactory = new TextParseNodeFactory();
				const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), mockFactory, undefined, mockHttpClient);
				const requestInformation = new RequestInformation();
				requestInformation.URL = "https://www.example.com";
				requestInformation.httpMethod = HttpMethod.GET;
				const result: TestEnum | undefined = await requestAdapter.sendEnum(requestInformation, TestEnumObject, undefined);
				assert.isDefined(result);
				assert.equal(result, enumResponse);
			});
		}
	});
	describe("send and deserialize collection of enum", () => {
		for (const statusCode of [200, 201, 202, 203]) {
			const enumResponse = `["a","b","c","e","f"]`;
			it(`should return object for status code ${statusCode}`, async () => {
				const mockHttpClient = new HttpClient();
				mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
					const response = new Response(enumResponse, {
						status: statusCode,
					} as ResponseInit);
					response.headers.set("Content-Type", "application/json");
					return Promise.resolve(response);
				};
				const mockFactory = new JsonParseNodeFactory();
				const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), mockFactory, undefined, mockHttpClient);
				const requestInformation = new RequestInformation();
				requestInformation.URL = "https://www.example.com";
				requestInformation.httpMethod = HttpMethod.GET;
				const result: TestEnum[] | undefined = await requestAdapter.sendCollectionOfEnum(requestInformation, TestEnumObject, undefined);
				assert.isDefined(result);
				assert.equal(result?.length, 3);
				assert.equal(result![0], "a");
				assert.equal(result![1], "b");
				assert.equal(result![2], "c");
			});
		}
	});
	describe("Throws API error", () => {
		it("should throw API error", async () => {
			const mockHttpClient = new HttpClient();
			mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
				const response = new Response("", {
					status: 500,
				} as ResponseInit);
				response.headers.set("client-request-id", "example-guid");
				return Promise.resolve(response);
			};
			const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), undefined, undefined, mockHttpClient);
			const requestInformation = new RequestInformation();
			requestInformation.URL = "https://www.example.com";
			requestInformation.httpMethod = HttpMethod.GET;

			try {
				await requestAdapter.sendNoResponseContent(requestInformation, undefined);
				assert.fail("Should have thrown an error");
			} catch (error) {
				assert.equal(error.responseStatusCode, 500);
				assert.equal(error.responseHeaders["client-request-id"], "example-guid");
			}
		});
	});
	describe("returns null on 3XX responses without location header", () => {
		it("should not throw API error when 3XX response with no Location header", async () => {
			const mockHttpClient = new HttpClient();
			mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
				const response = new Response(null, {
					status: 304,
				} as ResponseInit);
				response.headers.set("Content-Type", "application/json");
				return Promise.resolve(response);
			};
			const mockFactory = new MockParseNodeFactory(new MockParseNode({}));
			const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), mockFactory, undefined, mockHttpClient);
			const requestInformation = new RequestInformation();
			requestInformation.URL = "https://www.example.com";
			requestInformation.httpMethod = HttpMethod.GET;
			try {
				const result = await requestAdapter.send(requestInformation, createMockEntityFromDiscriminatorValue, undefined);
				assert.isUndefined(result);
			} catch (error) {
				assert.fail("Should not throw an error");
			}
		});
		it("should throw API error when 3XX response with a Location header", async () => {
			const mockHttpClient = new HttpClient();
			mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
				const response = new Response(null, {
					status: 304,
				} as ResponseInit);
				response.headers.set("Content-Type", "application/json");
				response.headers.set("Location", "xxx");
				return Promise.resolve(response);
			};
			const mockFactory = new MockParseNodeFactory(new MockParseNode({}));
			const requestAdapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), mockFactory, undefined, mockHttpClient);
			const requestInformation = new RequestInformation();
			requestInformation.URL = "https://www.example.com";
			requestInformation.httpMethod = HttpMethod.GET;
			try {
				await requestAdapter.sendNoResponseContent(requestInformation, undefined);
				assert.fail("Should have thrown an error");
			} catch (error) {
				assert.equal(error.responseStatusCode, 304);
			}
		});
	});
});
