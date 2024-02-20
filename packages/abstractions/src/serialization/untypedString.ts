import { UntypedNode } from "./untypedNode";

export class UntypedString extends UntypedNode {
  constructor(value: string) {
    super(value);
  }
  getValue(): string {
    return this.value as string;
  }
}

export function isUntypedString(node: UntypedNode): node is UntypedString {
  return typeof (node as UntypedString).value === "string";
}
