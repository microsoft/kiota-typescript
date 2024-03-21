/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { BackingStore } from "./backingStore";
import type { BackingStoreFactory } from "./backingStoreFactory";
import { InMemoryBackingStore } from "./inMemoryBackingStore";

/** This class is used to create instances of InMemoryBackingStore */
export class InMemoryBackingStoreFactory implements BackingStoreFactory {
  public createBackingStore(): BackingStore {
    return new InMemoryBackingStore();
  }
}
