/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { AnonymousAuthenticationProvider, HttpMethod, RequestInformation, RequestOption } from "@microsoft/kiota-abstractions";
import { assert } from "chai";

import { FetchRequestAdapter } from "../../src/fetchRequestAdapter";
import { HttpClient } from "../../src/httpClient";
import { getResponse } from "../testUtils";
import { CreateMockEntityFromParseNode, MockEntity } from "./mockEntity";
import { MockParseNode, MockParseNodeFactory } from "./mockParseNodeFactory";

// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}
describe("FetchRequestAdapter.ts", () => {
	describe("getClaimsFromResponse", () => {
		it("should get claims from response header", async () => {
			const mockHttpClient = new HttpClient();
			let executeFetchCount = 0;
			mockHttpClient.executeFetch = async (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>) => {
				let response = new Response("", {
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
			await requestAdapter.sendNoResponseContentAsync(requestInformation, undefined, undefined);
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
				const result = await requestAdapter.sendPrimitiveAsync(requestInformation, "ArrayBuffer", undefined, undefined);
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
				const result = await requestAdapter.sendPrimitiveAsync(requestInformation, "ArrayBuffer", undefined, undefined);
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
				const result = await requestAdapter.sendAsync(requestInformation, undefined, undefined, undefined);
				assert.isUndefined(result);
			});
		}
	});
	describe("send returns object on content", () => {
		for (const statusCode of [200, 201, 202, 203, 205]) {
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
				const result = await requestAdapter.sendAsync(requestInformation, CreateMockEntityFromParseNode, undefined, undefined);
				assert.isDefined(result);
			});
		}
	});
});
