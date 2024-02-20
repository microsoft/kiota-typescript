import type { UntypedNode } from "./untypedNode";

export interface UntypedNumber extends UntypedNode {
  getValue(): number;
}

export function isUntypedNumber(node: UntypedNode): node is UntypedNumber {
  return typeof (node as UntypedNumber).value === "number";
}
