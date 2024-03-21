/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { isUntypedNode, UntypedNode } from "./untypedNode";

/** Defines the interface for defining an untyped object value. */
export interface UntypedObject extends UntypedNode {
  /**
   * Gets the value of the UntypedNode as a Record<string, UntypedNode>.
   */
  getValue(): Record<string, UntypedNode>;
}

/**
 * Type guard to assert that an object instance is an UntypedObject.
 * @param node The object to check.
 * @return boolean indicating if the node is an UntypedObject.
 */
export function isUntypedObject(node: UntypedNode): node is UntypedObject {
  const proposedNode = node as UntypedObject;
  return (
    proposedNode &&
    proposedNode.value instanceof Object &&
    proposedNode.value instanceof Array === false &&
    Object.values(proposedNode.value).every((item) => isUntypedNode(item))
  );
}

/**
 * Factory to create an UntypedObject from a Record<string, UntypedNode>.
 * @param value The Record<string, UntypedNode> value to create from.
 * @return The created UntypedObject.
 */
export function createUntypedObject(
  value: Record<string, UntypedNode>,
): UntypedObject {
  return {
    value,
    getValue: () => value,
  };
}
