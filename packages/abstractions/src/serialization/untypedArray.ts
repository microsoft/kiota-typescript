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
  const proposedNode = node as UntypedArray;
  return (
    proposedNode &&
    proposedNode.value instanceof Array &&
    proposedNode.value.every((item) => isUntypedNode(item))
  );
}
