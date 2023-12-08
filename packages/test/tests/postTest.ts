import { apiClient, userId } from "./testClient";

import { assert } from "chai";
import { type Message } from "../generatedCode/models";

describe("TestPost", () => {

    it("should return a test", async () => {
        const message:Message =  {};
        message.subject = "Test Subject";
        message.body = {
            content: "body content"
        }
        const postmessageResult = await apiClient.users.byUserId(userId).messages.post(message);
        assert.isDefined(postmessageResult?.id);
        assert.equal(postmessageResult?.subject, message.subject);
    }).timeout(10000);
});