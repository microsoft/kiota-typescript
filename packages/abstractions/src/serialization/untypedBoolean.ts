import { UntypedNode } from "./untypedNode";

export class UntypedBoolean extends UntypedNode {
  constructor(value: boolean) {
    super(value);
  }
  getValue(): boolean {
    return this.value as boolean;
  }
}

export function isUntypedBoolean(node: UntypedNode): node is UntypedBoolean {
  return typeof (node as UntypedBoolean)?.value === "boolean";
}
