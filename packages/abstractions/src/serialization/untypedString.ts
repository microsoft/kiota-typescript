/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { UntypedNode } from "./untypedNode";

/** Defines the interface for defining an untyped string value. */
export interface UntypedString extends UntypedNode {
	/**
	 * Gets the value of the UntypedNode as a Record<string, UntypedNode>.
	 */
	getValue(): string;
}

/**
 * Type guard to assert that an object instance is an UntypedString.
 * @param node The object to check.
 * @returns boolean indicating if the node is an UntypedString.
 */
export function isUntypedString(node: UntypedNode): node is UntypedString {
	const proposedNode = node as UntypedString;
	return proposedNode && typeof proposedNode.value === "string";
}

/**
 * Factory to create an UntypedString from a string.
 * @param value The string value to create from.
 * @returns The created UntypedString.
 */
export function createUntypedString(value: string): UntypedString {
	return {
		value,
		getValue: () => value,
	};
}
