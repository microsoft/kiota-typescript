/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { HttpMethod } from "@microsoft/kiota-abstractions";
import { assert } from "chai";
import { Response } from "node-fetch";

import { ChaosHandler, ChaosStrategy, type FetchRequestInit } from "../../src";
import { DummyFetchHandler } from "./middleware/dummyFetchHandler";

describe("ChaosHandler.ts", () => {
	describe("constructor", () => {
		it("Should create an instance with given options", () => {
			const strategy = {
				chaosStrategy: ChaosStrategy.MANUAL,
				chaosPercentage: 90,
			};
			const handler = new ChaosHandler(strategy);
			assert.isDefined(handler["options"]);

			const options = handler["options"];
			assert.equal(options.chaosPercentage, 90);
			assert.equal(options.chaosStrategy, ChaosStrategy.MANUAL);
		});

		it("Should create an instance with default set of options", () => {
			const handler = new ChaosHandler();
			assert.isDefined(handler["options"]);
		});
	});
	describe("generateRandomStatusCode", () => {
		it("Should return a random status code within confines of the method", () => {
			const strategy = {
				chaosStrategy: ChaosStrategy.MANUAL,
				chaosPercentage: 90,
			};
			const handler = new ChaosHandler(strategy);
			assert.isDefined(handler["generateRandomStatusCode"](HttpMethod.GET));
			assert.isDefined(handler["generateRandomStatusCode"](HttpMethod.PATCH));
			assert.isDefined(handler["generateRandomStatusCode"](HttpMethod.POST));
			assert.isDefined(handler["generateRandomStatusCode"](HttpMethod.PUT));
			assert.isDefined(handler["generateRandomStatusCode"](HttpMethod.DELETE));
		});
	});
	describe("getRelativeURL", () => {
		it("Should return a url with a stripped base", () => {
			const strategy = {
				baseUrl: "https/graph.micrososft.com",
				chaosStrategy: ChaosStrategy.MANUAL,
				chaosPercentage: 90,
			};
			const handler = new ChaosHandler(strategy);
			const options = handler["options"];
			const url = handler["getRelativeURL"](options, "https/graph.micrososft.com/v1/me");
			assert.equal("/v1/me", url);
		});
	});
	describe("getStatusCode", () => {
		it("Should return a status code from the map when provided with options", () => {
			const strategy = {
				baseUrl: "https/graph.micrososft.com",
				chaosStrategy: ChaosStrategy.MANUAL,
				chaosPercentage: 90,
			};
			const manualMap: Map<string, Map<string, number>> = new Map([
				[
					"/v1/me",
					new Map([
						["GET", 501],
						["PATCH", 201],
					]),
				],
			]);
			const handler = new ChaosHandler(strategy, manualMap);
			const options = handler["options"];
			const hostUrl = "https/graph.micrososft.com/v1/me";
			assert.equal(handler["getStatusCode"](options, hostUrl, HttpMethod.GET), 501);
			assert.equal(handler["getStatusCode"](options, hostUrl, HttpMethod.PATCH), 201);
		});
		it("Should generate a random status code when no value is provided", () => {
			const handler = new ChaosHandler();
			const options = handler["options"];
			const statusCode = handler["getStatusCode"](options, "https/graph.micrososft.com/v1/me", HttpMethod.GET);
			assert.isDefined(statusCode);
			// must be an invalid code
			assert.isTrue(statusCode > 400);
			assert.isTrue(statusCode < 599);
		});
	});
	describe("createResponseBody", () => {
		it("Should return the provided resonse body when specified", () => {
			const strategy = {
				responseBody: {
					errorCode: "IN-1234",
					message: "Object is not in proper state for the action",
				},
			};
			const handler = new ChaosHandler(strategy);
			const options = handler["options"];
			const body = handler["createResponseBody"](options, 429);
			assert.equal(body, strategy.responseBody);
		});
		it("Should generate an error with the provided status body", () => {
			const strategy = {
				statusMessage: "Object is not in proper state for the action",
			};
			const handler = new ChaosHandler(strategy);
			const options = handler["options"];
			const body = handler["createResponseBody"](options, 429);
			assert.equal(body["error"]["message"], strategy.statusMessage);
		});
		it("Should generate an empty response body when provided with a `good` status code", () => {
			const handler = new ChaosHandler();
			const options = handler["options"];
			const body = handler["createResponseBody"](options, 200);
			assert.equal(JSON.stringify(body), JSON.stringify({}));
		});
	});
	describe("createChaosResponse", async () => {
		it("Should return a generated chaotic response", async () => {
			const handler = new ChaosHandler();
			const fetchRequestInit: FetchRequestInit = {
				method: "GET",
			};
			const response = handler["createChaosResponse"]("/v1/me", fetchRequestInit);
			assert.isTrue(response.status > 400);
			assert.isTrue(response.status < 599);
		});
	});
	describe("execute", async () => {
		it("Should generate chaos in the reponse when chaos is defined", async () => {
			const strategy = {
				chaosPercentage: 100, // chaos set it { x : x ∈ 0 ⩽ 100} , it will always happen
			};
			const handler = new ChaosHandler(strategy);
			handler.next = new DummyFetchHandler([new Response("", { status: 200 })] as any);
			const requestUrl = "/me";
			const fetchRequestInit: RequestInit = {
				method: "GET",
			};

			const response = await handler.execute(requestUrl, fetchRequestInit);
			assert.isTrue(response.status > 400);
			assert.isTrue(response.status < 599);
		});
	});
});
