import { apiClient } from "./testClient";


describe("TestGet", () => {


it("should return a test", async () => {
    const messages = apiClient.usersById("").messages().get();
    assert.isDefined(messages.value);
});
});