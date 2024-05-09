/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { UntypedNode } from "./untypedNode";

/** Defines the interface for defining an untyped null value. */
export interface UntypedNull extends UntypedNode {
	/**
	 * Gets the value of the UntypedNode as null.
	 */
	getValue(): null;
}

/**
 * Type guard to assert that an object instance is an UntypedNull.
 * @param node The object to check.
 * @return boolean indicating if the node is an UntypedNull.
 */
export function isUntypedNull(node: UntypedNode): node is UntypedNull {
	return node.value === null;
}

/**
 * Factory to create an UntypedNull from a boolean.
 * @return The created UntypedNull.
 */
export function createUntypedNull(): UntypedNull {
	return {
		value: null,
		getValue: () => null,
	};
}
