import type { UntypedNode } from "./untypedNode";

export interface UntypedString extends UntypedNode {
  getValue(): string;
}

export function isUntypedString(node: UntypedNode): node is UntypedString {
  return typeof (node as UntypedString).value === "string";
}
