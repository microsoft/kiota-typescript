import { UntypedNode } from "./untypedNode";

export interface UntypedString extends UntypedNode {
  getValue(): string;
}

export function isUntypedString(node: UntypedNode): node is UntypedString {
  return typeof (node as UntypedString)?.value === "string";
}

export function createUntypedString(value: string): UntypedString {
  return {
    value: value,
    getValue:  () => value as string,
  };
}