import { Parsable } from "../serialization";

/**
   * Check if the object is an instance a BackedModel
   * @param obj 
   * @returns 
   */
export function isBackingStoreEnabled<T extends Parsable>(obj: T): boolean {
    // TODO: check if the object is a BackedModel
    return true;
};