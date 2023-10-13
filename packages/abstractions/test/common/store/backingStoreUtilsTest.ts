import { assert } from "chai";
import { isBackingStoreEnabled } from "../../../src/store/backingStoreUtils";
import { TestBackedModel, createTestBackedModelFromDiscriminatorValue, createTestParserFromDiscriminatorValue } from "./testEntity";
import { ParseNode } from "../../../src";

it("Test backing store should be enabled if the parsableFactory has backingStore property", async () => {
    const testBackedModel = {} as TestBackedModel;
    const fields = createTestBackedModelFromDiscriminatorValue({} as ParseNode)(testBackedModel);
    const backingStoreEnabled = isBackingStoreEnabled(fields);
    assert.isTrue(backingStoreEnabled);
});

it("Test backing store should not be enabled if the parsableFactory lacks backingStore property", async () => {
    const testModel = {} as TestBackedModel;
    const fields = createTestParserFromDiscriminatorValue({} as ParseNode)(testModel);
    const backingStoreEnabled = isBackingStoreEnabled(fields);
    assert.isFalse(backingStoreEnabled);
});