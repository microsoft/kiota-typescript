import { proxyClient, userId } from "./testClient";

import { assert, describe, it } from "vitest";

import { type Message } from "../generatedCode/models";

describe("TestPost", () => {

    it("should return a test", async () => {
        const message:Message =  {};
        message.subject = "Test Subject";
        message.body = {
            content: "body content"
        }
        const postmessageResult = await proxyClient.users.byUserId(userId).messages.post(message);
        assert.isDefined(postmessageResult?.id);
        assert.equal(postmessageResult?.subject, message.subject);
        await proxyClient.users.byUserId(userId).messages.byMessageId(postmessageResult!.id!).delete();
    }, 10000);
});