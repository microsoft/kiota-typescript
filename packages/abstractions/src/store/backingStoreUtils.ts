import { Parsable, ParseNode, ParsableFactory } from "../serialization";

export const BackingStoreKey = "backingStore";

/**
   * Check if the object is an instance a BackedModel
   * @param obj 
   * @returns 
   */
export function isBackingStoreEnabled<T extends Parsable>(obj: T, parsableFactory: ParsableFactory<T>): boolean {
    // Check if the object has a backingStore property
    const fields = parsableFactory({} as ParseNode)(obj);
    return Object.keys(fields).includes(BackingStoreKey);
};