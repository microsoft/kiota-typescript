import { Parsable } from "../serialization";

/**
   * Check if the object is an instance a BackedModel
   * @param obj 
   * @returns 
   */
export function isBackingStoreEnabled<T extends Parsable>(obj: T): boolean {
    // Check if the object is a BackedModel
    return obj && typeof obj === 'object' && 'backingStore' in obj;
};