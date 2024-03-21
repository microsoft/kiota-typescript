/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { BackingStore } from "./backingStore";

/** Defines the contract for a factory that creates backing stores. */
export interface BackingStoreFactory {
  /**
   * Creates a new instance of the backing store.
   * @return a new instance of the backing store.
   */
  createBackingStore(): BackingStore;
}
