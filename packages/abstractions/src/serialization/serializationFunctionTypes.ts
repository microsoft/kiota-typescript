import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import type { SerializationWriter } from "./serializationWriter";

export type ModelSerializerFunction<T extends Parsable> = (
  writer: SerializationWriter,
  value?: Partial<T> | undefined,
) => void;

export type DeserializeIntoModelFunction<T extends Parsable> = (
  value?: Partial<T> | undefined,
) => Record<string, (node: ParseNode) => void>;
