import { beforeEach, describe, expect, it } from "vitest";
import { AuthorizationHandler } from "../../../src";
import { DummyFetchHandler } from "./dummyFetchHandler";
import { AccessTokenProvider, AllowedHostsValidator, BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";

describe("AuthorizationHandler", () => {
	let authorizationHandler: AuthorizationHandler;
	let nextMiddleware: DummyFetchHandler;

	beforeEach(() => {
		nextMiddleware = new DummyFetchHandler();
		const validator = new AllowedHostsValidator();
		const tokenProvider: AccessTokenProvider = {
			getAuthorizationToken: async () => "New Token",
			getAllowedHostsValidator: () => validator,
		};
		const provider = new BaseBearerTokenAuthenticationProvider(tokenProvider);
		authorizationHandler = new AuthorizationHandler(provider);
		authorizationHandler.next = nextMiddleware;
	});

	it("should not add a header if authorization header exists", async () => {
		const url = "https://example.com";
		const requestInit = {
			headers: {
				Authorization: "Bearer Existing Token",
			},
		};
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		await authorizationHandler.execute(url, requestInit);

		expect((requestInit.headers as Record<string, string>)["Authorization"]).toBe("Bearer Existing Token");
	});

	it("should attempt to authenticate when the header does not exist", async () => {
		const url = "https://example.com";
		const requestInit = { headers: {} };
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		await authorizationHandler.execute(url, requestInit);

		expect((requestInit.headers as Record<string, string>)["Authorization"]).toBe("Bearer New Token");
	});
});
