import { Parsable } from "./parsable";
import { ParseNode } from "./parseNode";
import { SerializationWriter } from "./serializationWriter";

export type SerializerMethod<T extends Parsable> = (
  writer: SerializationWriter,
  value?: T | undefined
) => void;

export type DeserializeMethod<T extends Parsable> = (
  value?: T | undefined
) => Record<string, (node: ParseNode) => void>;
