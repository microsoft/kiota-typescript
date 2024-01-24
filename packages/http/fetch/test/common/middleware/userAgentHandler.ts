import { assert } from "chai";

import { UserAgentHandler, UserAgentHandlerOptions } from "../../../src";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";

// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}
describe("userAgentHandler.ts", function () {
	const dummyFetchHandler = new DummyFetchHandler();
	describe("adds the user agent product", async () => {
		it("Should adds the product", async () => {
			const options = new UserAgentHandlerOptions();
			const handler = new UserAgentHandler(options);
			handler.next = dummyFetchHandler;
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })]);
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "GET",
			};
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			assert.equal(((fetchRequestInit as any).headers["User-Agent"] as string).split("/")[0], "kiota-typescript");
		});
		it("Does not add the product twice", async () => {
			const options = new UserAgentHandlerOptions();
			const handler = new UserAgentHandler(options);
			handler.next = dummyFetchHandler;
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 }), new Response("ok", { status: 200 })]);
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "GET",
			};
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			assert.equal(((fetchRequestInit as any).headers["User-Agent"] as string).split("kiota-typescript").length, 2);
		});
		it("Does not add the product when disabled", async () => {
			const options = new UserAgentHandlerOptions({ enable: false });
			const handler = new UserAgentHandler(options);
			handler.next = dummyFetchHandler;
			dummyFetchHandler.setResponses([new Response("ok", { status: 200 })]);
			const requestUrl = "url";
			const fetchRequestInit = {
				method: "GET",
			};
			await handler.execute(requestUrl, fetchRequestInit, undefined);
			assert.isUndefined((fetchRequestInit as any).headers);
		});
	});
});
