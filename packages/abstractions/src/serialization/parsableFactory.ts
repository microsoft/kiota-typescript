import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import { DeserializeIntoModelFunction } from "./serializationFunctionTypes";

/**
 * Defines the factory to get the deserializers constructing the parsable models.
 * @param parseNode The node to parse use to get the discriminator value from the payload.
 * @returns The parsable object.
 */
export type ParsableFactory<T extends Parsable> = (
  parseNode: ParseNode | undefined
) => DeserializeIntoModelFunction<T>;
