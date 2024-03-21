import { RequestInformation } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { AzureAdSpfxAccessTokenProvider,AzureAdSpfxAuthenticationProvider } from "../src";
import { MockAadTokenProvider } from "./mockAadTokenProvider";

// TODO (musale) fix this test for browser
describe("Test authentication using SharePoint Framework", () => {

    it("AccessToken is returned correctly from getAuthorizationToken function", async () => {
        const expectedToken = "dummy_valid_token";
        const appIdUri = "api://api_client_id";
        const allowedHosts: Set<string> = new Set<string>([
            "myapi.azurewebsites.net"
        ]);

        const mockTokenProvider = new MockAadTokenProvider(expectedToken);

        const accessTokenProvider = new AzureAdSpfxAccessTokenProvider(
            mockTokenProvider as any,
            appIdUri,
            allowedHosts);

        const accessToken: string = await accessTokenProvider.getAuthorizationToken(
            "https://myapi.azurewebsites.net/endpoint");

        assert.equal(expectedToken, accessToken);
    });

    it("AccessToken is empty when requested URL is not in allowedHosts", async () => {
        const expectedToken = "dummy_valid_token";
        const appIdUri = "api://api_client_id";
        const allowedHosts: Set<string> = new Set<string>([
            "myapi.azurewebsites.net"
        ]);

        const mockTokenProvider = new MockAadTokenProvider(expectedToken);

        const accessTokenProvider = new AzureAdSpfxAccessTokenProvider(
            mockTokenProvider as any,
            appIdUri,
            allowedHosts);

        const accessToken: string = await accessTokenProvider.getAuthorizationToken(
            "https://notallowedhost.azurewebsites.net/endpoint");

        assert.equal("", accessToken);
    });

    it("AccessToken is appended correctly in header by AzureAdSpfxAuthenticationProvider", async () => {
        const expectedToken = "dummy_valid_token";
        const appIdUri = "api://api_client_id";
        const allowedHosts: Set<string> = new Set<string>([
            "myapi.azurewebsites.net"
        ]);

        const mockTokenProvider = new MockAadTokenProvider(expectedToken);

        const azureAdSpfxAuthProvider = new AzureAdSpfxAuthenticationProvider(
            mockTokenProvider as any, appIdUri, allowedHosts);

        const request: RequestInformation = new RequestInformation();
        request.urlTemplate = "test";
        request.URL = "https://myapi.azurewebsites.net/v1.0/endpoint";

        await azureAdSpfxAuthProvider.authenticateRequest(request);

        assert.equal(
            request.headers.tryGetValue("Authorization")![0],
            "Bearer " + expectedToken
          );
    });
});