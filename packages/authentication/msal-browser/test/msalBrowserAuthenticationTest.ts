/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type AccountInfo, type AuthenticationResult, type IPublicClientApplication, InteractionRequiredAuthError, InteractionType } from "@azure/msal-browser";
import { RequestInformation } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { MsalBrowserAccessTokenProvider } from "../src/msalBrowserAccessTokenProvider";
import { MsalBrowserAuthenticationProvider } from "../src/msalBrowserAuthenticationProvider";

describe("MsalBrowserAccessTokenProvider and MsalBrowserAuthenticationProvider", () => {
	const scopes = ["user.read"];
	const dummyAccount: AccountInfo = {
		homeAccountId: "home-123",
		environment: "login.microsoftonline.com",
		tenantId: "tenant-123",
		username: "user@example.com",
		localAccountId: "local-123",
	};

	const createMockClientApp = (overrides: Partial<IPublicClientApplication> = {}): IPublicClientApplication => {
		return {
			acquireTokenSilent: () => Promise.resolve({ accessToken: "dummy_silent_token" } as AuthenticationResult),
			acquireTokenPopup: () => Promise.resolve({ accessToken: "dummy_popup_token" } as AuthenticationResult),
			acquireTokenRedirect: () => Promise.resolve(),
			...overrides,
		} as unknown as IPublicClientApplication;
	};

	it("Throws if config or clientApplication is missing", () => {
		assert.throws(() => new MsalBrowserAccessTokenProvider(null as any), /config cannot be null or undefined/);
		assert.throws(() => new MsalBrowserAccessTokenProvider({} as any), /config.clientApplication cannot be null or undefined/);
	});

	it("AccessToken is returned correctly from getAuthorizationToken function via acquireTokenSilent", async () => {
		let capturedRequest: any;
		const mockApp = createMockClientApp({
			acquireTokenSilent: (request) => {
				capturedRequest = request;
				return Promise.resolve({ accessToken: "valid_token" } as AuthenticationResult);
			},
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
			account: dummyAccount,
		});

		const token = await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/me");
		assert.equal(token, "valid_token");
		assert.deepEqual(capturedRequest.scopes, scopes);
		assert.deepEqual(capturedRequest.account, dummyAccount);
	});

	it("Falls back to popup when acquireTokenSilent throws InteractionRequiredAuthError and interactionType is Popup", async () => {
		let popupCalled = false;
		const mockApp = createMockClientApp({
			acquireTokenSilent: () => Promise.reject(new InteractionRequiredAuthError("interaction_required", "need interaction")),
			acquireTokenPopup: (request) => {
				popupCalled = true;
				assert.deepEqual(request.scopes, scopes);
				return Promise.resolve({ accessToken: "popup_token" } as AuthenticationResult);
			},
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
			interactionType: InteractionType.Popup,
		});

		const token = await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/me");
		assert.isTrue(popupCalled);
		assert.equal(token, "popup_token");
	});

	it("Triggers redirect when acquireTokenSilent throws InteractionRequiredAuthError and interactionType is Redirect", async () => {
		let redirectCalled = false;
		const mockApp = createMockClientApp({
			acquireTokenSilent: () => Promise.reject(new InteractionRequiredAuthError("interaction_required", "need interaction")),
			acquireTokenRedirect: (request) => {
				redirectCalled = true;
				assert.deepEqual(request.scopes, scopes);
				return Promise.resolve();
			},
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
			interactionType: InteractionType.Redirect,
		});

		const token = await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/me");
		assert.isTrue(redirectCalled);
		assert.equal(token, "");
	});

	it("Re-throws unexpected error from acquireTokenSilent", async () => {
		const mockApp = createMockClientApp({
			acquireTokenSilent: () => Promise.reject(new Error("Network failure")),
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
		});

		let thrown = false;
		try {
			await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/me");
		} catch (error: any) {
			thrown = true;
			assert.equal(error.message, "Network failure");
		}
		assert.isTrue(thrown);
	});

	it("Decodes and passes CAE claims to acquireTokenSilent", async () => {
		let capturedClaims: string | undefined;
		const mockApp = createMockClientApp({
			acquireTokenSilent: (request) => {
				capturedClaims = request.claims;
				return Promise.resolve({ accessToken: "cae_token" } as AuthenticationResult);
			},
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
		});

		const rawClaims = btoa('{"access_token":{"nbf":{"essential":true,"value":"1652813508"}}}');
		const token = await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/me", {
			claims: rawClaims,
		});

		assert.equal(token, "cae_token");
		assert.equal(capturedClaims, '{"access_token":{"nbf":{"essential":true,"value":"1652813508"}}}');
	});

	it("Infers scope from URL when scopes array is empty", async () => {
		let capturedScopes: string[] | undefined;
		const mockApp = createMockClientApp({
			acquireTokenSilent: (request) => {
				capturedScopes = request.scopes;
				return Promise.resolve({ accessToken: "inferred_token" } as AuthenticationResult);
			},
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes: [],
		});

		const token = await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/users");
		assert.equal(token, "inferred_token");
		assert.deepEqual(capturedScopes, ["https://graph.microsoft.com/.default"]);
	});

	it("Does not mutate shared scopes across different URL hosts", async () => {
		const capturedScopesList: string[][] = [];
		const mockApp = createMockClientApp({
			acquireTokenSilent: (request) => {
				capturedScopesList.push(request.scopes);
				return Promise.resolve({ accessToken: "inferred_token" } as AuthenticationResult);
			},
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes: [],
		});

		await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/users");
		await provider.getAuthorizationToken("https://graph.microsoft.us/v1.0/users");

		assert.deepEqual(capturedScopesList[0], ["https://graph.microsoft.com/.default"]);
		assert.deepEqual(capturedScopesList[1], ["https://graph.microsoft.us/.default"]);
	});

	it("Passes configured account to popup request on fallback", async () => {
		let capturedPopupRequest: any;
		const mockApp = createMockClientApp({
			acquireTokenSilent: () => Promise.reject(new InteractionRequiredAuthError("interaction required")),
			acquireTokenPopup: (request) => {
				capturedPopupRequest = request;
				return Promise.resolve({ accessToken: "popup_token" } as AuthenticationResult);
			},
		});

		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
			account: dummyAccount,
			interactionType: InteractionType.Popup,
		});

		const token = await provider.getAuthorizationToken("https://graph.microsoft.com/v1.0/me");
		assert.equal(token, "popup_token");
		assert.equal(capturedPopupRequest?.account, dummyAccount);
	});

	it("Returns empty string for non-allowed hosts or missing URL", async () => {
		const mockApp = createMockClientApp();
		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
		});

		assert.equal(await provider.getAuthorizationToken(""), "");
		assert.equal(await provider.getAuthorizationToken("https://untrusted.domain.com/api"), "");
	});

	it("MsalBrowserAuthenticationProvider appends Authorization header to RequestInformation", async () => {
		const mockApp = createMockClientApp({
			acquireTokenSilent: () => Promise.resolve({ accessToken: "auth_header_token" } as AuthenticationResult),
		});

		const authProvider = new MsalBrowserAuthenticationProvider({
			clientApplication: mockApp,
			scopes,
		});

		const request = new RequestInformation();
		request.urlTemplate = "test";
		request.URL = "https://graph.microsoft.com/v1.0/me";

		await authProvider.authenticateRequest(request);
		assert.equal(request.headers.tryGetValue("Authorization")![0], "Bearer auth_header_token");
	});

	it("Returns allowed hosts validator", () => {
		const mockApp = createMockClientApp();
		const provider = new MsalBrowserAccessTokenProvider({
			clientApplication: mockApp,
			scopes,
		});

		assert.isDefined(provider.getAllowedHostsValidator());
		assert.isTrue(provider.getAllowedHostsValidator().isUrlHostValid("https://graph.microsoft.com/v1.0"));
	});
});
