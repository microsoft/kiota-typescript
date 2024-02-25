import { UntypedNode } from "./untypedNode";

export class UntypedNumber extends UntypedNode {
  constructor(value: number) {
    super(value);
  }
  getValue(): number {
    return this.value as number;
  }
}

export function isUntypedNumber(node: UntypedNode): node is UntypedNumber {
  return typeof (node as UntypedNumber)?.value === "number";
}
