import { isUntypedNode, UntypedNode } from "./untypedNode";

export interface UntypedObject extends UntypedNode {
  getValue(): Record<string, UntypedNode> ;
}

export function isUntypedObject(node: UntypedNode): node is UntypedObject {
  const proposedNode = node as UntypedObject;
  return (
    proposedNode &&
    proposedNode.value instanceof Object &&
    proposedNode.value instanceof Array === false &&
    Object.values(proposedNode.value).every((item) => isUntypedNode(item))
  );
}

export function createUntypedObject(value: Record<string, UntypedNode>): UntypedObject {
  return {
    value: value,
    getValue:  () => value as Record<string, UntypedNode>,
  };
}