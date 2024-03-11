import { proxyClient, userId } from "./testClient";

import { assert, describe, it } from "vitest";

describe("TestGet", () => {

    it("should return a test", async () => {
        const messages = await proxyClient.users.byUserId(userId).messages.get();
        assert.isDefined(messages?.value);
    });
    it("should decode query parameters", async () => {
        const messages = await proxyClient.users.byUserId(userId).messages.get({
            queryParameters: {
                select: ["subject"],
                search: "test",
                count: true,
            }
        });
        const messagesRaw = proxyClient.users.withUrl("foo");
        assert.isDefined(messagesRaw);
        const messagesRI = proxyClient.users.byUserId(userId).messages.toGetRequestInformation({
            queryParameters: {
                count: true,
            }
        });
        assert.equal(`https://graph.microsoft.com/v1.0/users/${userId}/messages?%24count=true`, messagesRI.URL);
        assert.isDefined(messages?.value);
    });
});