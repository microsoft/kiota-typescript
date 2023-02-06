import { apiClient } from "./testClient";

import { assert } from "chai";
import { Message } from "../generatedCode/models";
import "../generatedCode/users/item";
import "../generatedCode/users/item/messages/item/"
describe("TestPost", () => {

    it("should return a test", async () => {
        const message:Message =  {};
        message.subject = "Test Subject";
        message.body = {
            content: "body content"
        }
        const postmessageResult = await apiClient.userItem("813956a3-4a30-4596-914f-bfd86a657a09").messageItem("zxczxc").patch(message);

    console.log(postmessageResult);
        // assert.isDefined(postmessageResult?.id);
        // assert.equal(postmessageResult?.subject, message.subject);
    }).timeout(10000);
});