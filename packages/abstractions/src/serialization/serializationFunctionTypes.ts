import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import type { SerializationWriter } from "./serializationWriter";

export type ModelSerializerFunction<T extends Parsable> = (
  writer: SerializationWriter,
  value?: T | undefined
) => void;

export type DeserializeIntoModelFunction<T extends Parsable> = (
  value?: T | undefined
) => Record<string, (node: ParseNode) => void>;
