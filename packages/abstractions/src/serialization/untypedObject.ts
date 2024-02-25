import { isUntypedNode, UntypedNode } from "./untypedNode";

export class UntypedObject extends UntypedNode {
  constructor(value: Record<string, UntypedNode>) {
    super(value);
  }
  getValue(): Record<string, UntypedNode> {
    return this.value as Record<string, UntypedNode>;
  }
}

export function isUntypedObject(node: UntypedNode): node is UntypedObject {
  const value = (node as UntypedObject)?.value;
  return (
    value instanceof Object &&
    value instanceof Array === false &&
    Object.values(value).every((item) => isUntypedNode(item))
  );
}
