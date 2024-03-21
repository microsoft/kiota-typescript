/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { UntypedNode } from "./untypedNode";

/** Defines an interface for defining an untyped boolean. */
export interface UntypedBoolean extends UntypedNode {
  /**
   * Gets the value of the UntypedNode as a boolean value.
   */
  getValue(): boolean;
}

/**
 * Type guard to assert that an UntypedNode instance is an UntypedBoolean.
 * @param node The UntypedNode to check.
 * @return boolean indicating if the node is an UntypedBoolean.
 */
export function isUntypedBoolean(node: UntypedNode): node is UntypedBoolean {
  const proposedNode = node as UntypedBoolean;
  return proposedNode && typeof proposedNode.value === "boolean";
}

/**
 * Factory to create an UntypedBoolean from a boolean.
 * @param value The boolean value to create from.
 * @return The created UntypedBoolean.
 */
export function createUntypedBoolean(value: boolean): UntypedBoolean {
  return {
    value,
    getValue: () => value,
  };
}
