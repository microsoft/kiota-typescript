import { apiClient, proxyClient, userId } from "./testClient";

import { assert } from "chai";

describe("TestGet", () => {

    it("should return a test", async () => {
        const messages = await apiClient.users.byUserId(userId).messages.get();
        assert.isDefined(messages?.value);
    });
    it("should decode query parameters", async () => {
        const messages = await apiClient.users.byUserId(userId).messages.get({
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
        assert.equal("foo", messagesRI.URL);
        assert.isDefined(messages?.value);
    });
});