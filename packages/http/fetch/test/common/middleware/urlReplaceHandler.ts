import { assert, describe, it } from "vitest";

import { UrlReplaceHandlerOptions } from "../../../src/middlewares/options/urlReplaceHandlerOptions";
import { UrlReplaceHandler } from "../../../src/middlewares/urlReplaceHandler";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";
// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}

describe("UrlReplaceHandler.ts", function () {
	const dummyFetchHandler = new DummyFetchHandler();
	const urlReplaceHandler = new UrlReplaceHandler(
		new UrlReplaceHandlerOptions({
			enabled: true,
			urlReplacements: {
				"/users/meTokenToReplace": "/me",
			},
		}),
	);
	urlReplaceHandler.next = dummyFetchHandler;
	describe("replaceTokensInUrl", () => {
		it("Should replace the token in the url", () => {
			dummyFetchHandler.setResponses([
				new Response("", {
					status: 200,
					statusText: "OK",
				}),
			]);
			const requestUrl = "https://graph.microsoft.com/v1.0/users/meTokenToReplace/messages";
			const fetchRequestInit = {
				method: "GET",
			};
			urlReplaceHandler.execute(requestUrl, fetchRequestInit);
			assert.equal(dummyFetchHandler.urls[0], "https://graph.microsoft.com/v1.0/me/messages");
			dummyFetchHandler.urls = [];
		});
		it("Should not replace the token in the url", () => {
			dummyFetchHandler.setResponses([
				new Response("", {
					status: 200,
					statusText: "OK",
				}),
			]);
			const requestUrl = "https://graph.microsoft.com/v1.0/users/meOtherToReplace/messages";
			const fetchRequestInit = {
				method: "GET",
			};
			urlReplaceHandler.execute(requestUrl, fetchRequestInit);
			assert.equal(dummyFetchHandler.urls[0], "https://graph.microsoft.com/v1.0/users/meOtherToReplace/messages");
			dummyFetchHandler.urls = [];
		});
	});
});
