/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import type { SerializationWriter } from "./serializationWriter";
import type { ParsableFactory } from "./parsableFactory";
import type { DeserializeIntoModelFunction } from "./serializationFunctionTypes";

/** Defines the base interface for defining an untyped node. */
export interface UntypedNode extends Parsable {
	/**
	 * Gets the value of the UntypedNode.
	 */
	getValue(): unknown;
	/**
	 * The value represented by the UntypedNode.
	 */
	value?: unknown;
}

/**
 * Factory to create an UntypedNode from a string during deserialization.
 */
export const createUntypedNodeFromDiscriminatorValue: ParsableFactory<UntypedNode> = (_parseNode: ParseNode | undefined): ((_instance?: Parsable) => Record<string, (_node: ParseNode) => void>) => {
	return deserializeIntoUntypedNode;
};

/**
 * Type guard to assert that an object instance is an UntypedNode.
 * @param node The object to check.
 * @return boolean indicating if the node is an UntypedNode.
 */
export const isUntypedNode = (node: unknown): node is UntypedNode => {
	const potentialNode = node as UntypedNode;
	return potentialNode?.getValue !== undefined;
};

/**
 * The deserialization implementation for UntypedNode.
 */
export const deserializeIntoUntypedNode: DeserializeIntoModelFunction<UntypedNode> = (untypedNode: Partial<UntypedNode> | undefined = {}): Record<string, (node: ParseNode) => void> => {
	return {
		value: (_n) => {
			untypedNode.value = null;
		},
		getValue: (_n) => {
			untypedNode.getValue = () => untypedNode.value;
		},
	};
};

/**
 * The serialization implementation for UntypedNode.
 */
export const serializeUntypedNode = (_writer: SerializationWriter, _errorDetails: Partial<UntypedNode> | undefined = {}): void => {
	return;
};
