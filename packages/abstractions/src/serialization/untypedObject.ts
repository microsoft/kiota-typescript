import { isUntypedNode, type UntypedNode } from "./untypedNode";

export interface UntypedObject extends UntypedNode {
  getValue(): Record<string, UntypedNode>;
}

export function isUntypedObject(node: UntypedNode): node is UntypedObject {
  const value = (node as UntypedObject).value;
  return (
    value instanceof Object &&
    Object.values(value).every((item) => isUntypedNode(item))
  );
}
