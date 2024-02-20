import { isUntypedNode, type UntypedNode } from "./untypedNode";

export interface UntypedArray extends UntypedNode {
  getValue(): UntypedNode[];
}

export function isUntypedArray(node: UntypedNode): node is UntypedArray {
  const value = (node as UntypedArray).value;
  return value instanceof Array && value.every((item) => isUntypedNode(item));
}
