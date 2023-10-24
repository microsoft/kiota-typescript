import { type ParseNode } from "../serialization";

export const BackingStoreKey = "backingStoreEnabled";

/**
   * Check if the object is an instance a BackedModel
   * @param obj 
   * @returns 
   */
export function isBackingStoreEnabled(fields: Record<string, (node: ParseNode) => void> ): boolean {
    // Check if the fields contain the backing store key
    return Object.keys(fields).includes(BackingStoreKey);
};