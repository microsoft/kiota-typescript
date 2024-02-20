import { isUntypedNode, UntypedNode } from "./untypedNode";

export class UntypedArray extends UntypedNode {
  constructor(value: UntypedNode[]) {
    super(value);
  }
  getValue(): UntypedNode[] {
    return this.value as UntypedNode[];
  }
}

export function isUntypedArray(node: UntypedNode): node is UntypedArray {
  const value = (node as UntypedArray).value;
  return value instanceof Array && value.every((item) => isUntypedNode(item));
}
