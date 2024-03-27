/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { BackingStore } from "./backingStore";

/** Defines the contracts for a model that is backed by a store. */
export interface BackedModel {
	/**
	 * Gets the store that is backing the model.
	 */
	backingStore?: BackingStore;
}
