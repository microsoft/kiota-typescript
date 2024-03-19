import { UntypedNode } from "./untypedNode";

export interface UntypedNull extends UntypedNode {
  getValue(): null;
}

export function isUntypedNull(node: UntypedNode): node is UntypedNull {
  return node.value === null;
}

export function createUntypedNull(): UntypedNull {
  return {
    value: null,
    getValue:  () => null,
  };
}
