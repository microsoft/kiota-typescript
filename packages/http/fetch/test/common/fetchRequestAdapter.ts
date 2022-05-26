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
});
