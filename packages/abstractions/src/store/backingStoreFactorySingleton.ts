/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { BackingStoreFactory } from "./backingStoreFactory";
import { InMemoryBackingStoreFactory } from "./inMemoryBackingStoreFactory";

export class BackingStoreFactorySingleton {
  public static instance: BackingStoreFactory =
    new InMemoryBackingStoreFactory();
}
