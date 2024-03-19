import { isUntypedNode, UntypedNode } from "./untypedNode";

export interface UntypedArray extends UntypedNode {
  getValue(): UntypedNode[];
}

export function isUntypedArray(node: UntypedNode): node is UntypedArray {
  const proposedNode = node as UntypedArray;
  return (
    proposedNode &&
    proposedNode.value instanceof Array &&
    proposedNode.value.every((item) => isUntypedNode(item))
  );
}

export function createUntypedArray(value: UntypedNode[]): UntypedArray {
  return {
    value: value,
    getValue:  () => value as UntypedNode[],
  };
}