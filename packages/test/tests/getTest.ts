import { apiClient } from "./testClient";
import "../generatedCode/users";
import "../generatedCode/users/item/mailFolders";
import "../generatedCode/users/item/mailFolders/item/childFolders";

import { assert } from "chai";
import { MessagesRequestBuilderGetQueryParameters } from "../generatedCode/users/item/messages/messagesRequestBuilderGetQueryParameters";

describe("TestGet", () => {

    it("should return a test", async () => {
        const messages = await apiClient.usersById("813956a3-4a30-4596-914f-bfd86a657a09").messages.get();
        assert.isDefined(messages?.value);
    });
    it("should decode query parameters", async () => {
        const qs = {} as MessagesRequestBuilderGetQueryParameters;
        qs.select = ["subject"];
        qs.search = "test";
        qs.count = true;
        const messages = await apiClient.usersById("813956a3-4a30-4596-914f-bfd86a657a09").messages.get();
        assert.isDefined(messages?.value);
        const response = await apiClient.usersById("").mailFoldersById("").childFolders.get();
    });
});