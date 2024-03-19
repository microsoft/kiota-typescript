import { UntypedNode } from "./untypedNode";

export interface UntypedBoolean extends UntypedNode {
  getValue(): boolean;
}

export function isUntypedBoolean(node: UntypedNode): node is UntypedBoolean {
  return typeof (node as UntypedBoolean)?.value === "boolean";
}

export function createUntypedBoolean(value: boolean): UntypedBoolean {
  return {
    value: value,
    getValue:  () => value as boolean,
  };
}