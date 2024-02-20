import type { UntypedNode } from "./untypedNode";

export interface UntypedNull extends UntypedNode {
  getValue(): null;
}

export function isUntypedNull(node: UntypedNode): node is UntypedNull {
  return (node as UntypedNull).value === null;
}
