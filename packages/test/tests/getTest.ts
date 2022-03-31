import { apiClient } from "./testClient";

import { assert } from "chai";

describe("TestGet", () => {


    it("should return a test", async () => {
        const messages = await apiClient.usersById("813956a3-4a30-4596-914f-bfd86a657a09").messages.get();
        assert.isDefined(messages?.value);
    });
});