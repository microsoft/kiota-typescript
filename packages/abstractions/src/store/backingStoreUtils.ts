/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type ParseNode } from "../serialization";

export const BackingStoreKey = "backingStoreEnabled";

/**
 * Check if the object is an instance a BackedModel
 * @param fields The fields of the object
 * @returns boolean indicating if the object is a BackedModel
 */
export function isBackingStoreEnabled(fields: Record<string, (node: ParseNode) => void>): boolean {
	// Check if the fields contain the backing store key
	return Object.keys(fields).includes(BackingStoreKey);
}
