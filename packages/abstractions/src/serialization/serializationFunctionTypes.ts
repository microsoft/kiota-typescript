import { Parsable } from "./parsable";
import { ParseNode } from "./parseNode";
import { SerializationWriter } from "./serializationWriter";

export type ModelSerializerFunction<T extends Parsable> = (
  writer: SerializationWriter,
  value?: T | undefined
) => void;

export type DeserializeIntoModelFunction<T extends Parsable> = (
  value?: T | undefined
) => Record<string, (node: ParseNode) => void>;
