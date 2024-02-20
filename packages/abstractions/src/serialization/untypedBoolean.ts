import type { UntypedNode } from "./untypedNode";

export interface UntypedBoolean extends UntypedNode {
  getValue(): boolean;
}

export function isUntypedBoolean(node: UntypedNode): node is UntypedBoolean {
  return typeof (node as UntypedBoolean).value === "boolean";
}
