import { assert } from "chai";
import { isBackingStoreEnabled } from "../../../src/store/backingStoreUtils";
import { TestBackedModel, createTestBackedModelFromDiscriminatorValue, createTestParserFromDiscriminatorValue } from "./testEntity";

it("Test backing store should be enabled if the parsableFactory has backingStore property", async () => {
    const testBackedModel = {} as TestBackedModel;
    const backingStoreEnabled = isBackingStoreEnabled(testBackedModel, createTestBackedModelFromDiscriminatorValue);
    assert.isTrue(backingStoreEnabled);
});

it("Test backing store should not be enabled if the parsableFactory lacks backingStore property", async () => {
    const testBackedModel = {} as TestBackedModel;
    const backingStoreEnabled = isBackingStoreEnabled(testBackedModel, createTestParserFromDiscriminatorValue);
    assert.isFalse(backingStoreEnabled);
});