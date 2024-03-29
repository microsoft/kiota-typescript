import { isUntypedNode, UntypedNode } from "./untypedNode";

/** Defines an interface for defining an untyped array. */
export interface UntypedArray extends UntypedNode {
  /**
   * Gets the value of the UntypedNode as an array of UntypedNodes.
   */
  getValue(): UntypedNode[];
}

/**
 * Type guard to assert that an UntypedNode instance is an UntypedArray.
 * @param node The UntypedNode to check.
 * @return boolean indicating if the node is an UntypedArray.
 */
export function isUntypedArray(node: UntypedNode): node is UntypedArray {
  const proposedNode = node as UntypedArray;
  return (
    proposedNode &&
    proposedNode.value instanceof Array &&
    proposedNode.value.every((item) => isUntypedNode(item))
  );
}

/**
 * Factory to create an UntypedArray from an array of UntypedNodes.
 * @param value The value to create from.
 * @return The created UntypedArray.
 */
export function createUntypedArray(value: UntypedNode[]): UntypedArray {
  return {
    value: value,
    getValue: () => value as UntypedNode[],
  };
}
