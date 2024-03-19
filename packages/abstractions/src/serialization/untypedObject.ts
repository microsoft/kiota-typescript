import { isUntypedNode, UntypedNode } from "./untypedNode";

export interface UntypedObject extends UntypedNode {
  getValue(): Record<string, UntypedNode> ;
}

export function isUntypedObject(node: UntypedNode): node is UntypedObject {
  const value = (node as UntypedObject)?.value;
  return (
    value instanceof Object &&
    value instanceof Array === false &&
    Object.values(value).every((item) => isUntypedNode(item))
  );
}

export function createUntypedObject(value: Record<string, UntypedNode>): UntypedObject {
  return {
    value: value,
    getValue:  () => value as Record<string, UntypedNode>,
  };
}