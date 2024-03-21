/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import type { DeserializeIntoModelFunction } from "./serializationFunctionTypes";

/**
 * Defines the factory to get the deserializers constructing the parsable models.
 * @param parseNode The node to parse use to get the discriminator value from the payload.
 * @returns The parsable object.
 */
export type ParsableFactory<T extends Parsable> = (
  parseNode: ParseNode | undefined
) => DeserializeIntoModelFunction<T>;
