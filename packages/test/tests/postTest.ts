import { apiClient } from "./testClient";

import { assert } from "chai";
import { Message } from "../generatedCode/models";

describe("TestPost", () => {

    it("should return a test", async () => {
        const message:Message =  new Message();
        message.subject = "Test Subject";
        const postmessageResult = await apiClient.usersById("813956a3-4a30-4596-914f-bfd86a657a09").messages.post(message);
        assert.isDefined(postmessageResult?.id);
        assert.equal(postmessageResult?.subject, message.subject);
    }).timeout(10000);
});