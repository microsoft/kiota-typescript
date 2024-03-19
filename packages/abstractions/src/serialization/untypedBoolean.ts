import { UntypedNode } from "./untypedNode";

export interface UntypedBoolean extends UntypedNode {
  getValue(): boolean;
}

export function isUntypedBoolean(node: UntypedNode): node is UntypedBoolean {
  const proposedNode = node as UntypedBoolean;
  return proposedNode && typeof proposedNode.value === "boolean";
}

export function createUntypedBoolean(value: boolean): UntypedBoolean {
  return {
    value: value,
    getValue:  () => value as boolean,
  };
}