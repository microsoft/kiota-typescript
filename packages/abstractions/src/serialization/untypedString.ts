import { UntypedNode } from "./untypedNode";

export interface UntypedString extends UntypedNode {
  getValue(): string;
}

export function isUntypedString(node: UntypedNode): node is UntypedString {
  const proposedNode = node as UntypedString;
  return proposedNode && typeof proposedNode.value === "string";
}

export function createUntypedString(value: string): UntypedString {
  return {
    value: value,
    getValue:  () => value as string,
  };
}