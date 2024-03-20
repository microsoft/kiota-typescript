import { UntypedNode } from "./untypedNode";

/** Defines the interface for defining an untyped number value. */
export interface UntypedNumber extends UntypedNode {
  /**
   * Gets the value of the UntypedNode as a number.
   */
  getValue(): number;
}

/**
 * Type guard to assert that an object instance is an UntypedNumber.
 * @param node The object to check.
 * @return boolean indicating if the node is an UntypedNumber.
 */
export function isUntypedNumber(node: UntypedNode): node is UntypedNumber {
  const proposedNode = node as UntypedNumber;
  return proposedNode && typeof proposedNode.value === "number";
}

/**
 * Factory to create an UntypedNumber from a number.
 * @param value The number value to create from.
 * @return The created UntypedNumber.
 */
export function createUntypedNumber(value: number): UntypedNumber {
  return {
    value: value,
    getValue: () => value as number,
  };
}
