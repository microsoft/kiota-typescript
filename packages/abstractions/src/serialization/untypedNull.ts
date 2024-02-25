import { UntypedNode } from "./untypedNode";

export class UntypedNull extends UntypedNode {
  constructor() {
    super(null);
  }
  getValue(): null {
    return null;
  }
}

export function isUntypedNull(node: UntypedNode): node is UntypedNull {
  return (node as UntypedNull)?.value === null;
}
