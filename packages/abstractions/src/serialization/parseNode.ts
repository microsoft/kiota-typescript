/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { Guid } from "guid-typescript";

import type { DateOnly } from "../dateOnly";
import type { Duration } from "../duration";
import type { TimeOnly } from "../timeOnly";
import type { Parsable } from "./parsable";
import type { ParsableFactory } from "./parsableFactory";

/**
 * Interface for a deserialization node in a parse tree. This interface provides an abstraction layer over serialization formats, libraries and implementations.
 */
export interface ParseNode {
	/**
	 * Gets the string value of the node.
	 * @returns the string value of the node.
	 */
	getStringValue(): string | undefined;
	/**
	 * Gets a new parse node for the given identifier.
	 * @param identifier the identifier of the current node property.
	 * @returns a new parse node for the given identifier.
	 */
	getChildNode(identifier: string): ParseNode | undefined;
	/**
	 * Gets the boolean value of the node.
	 * @returns the boolean value of the node.
	 */
	getBooleanValue(): boolean | undefined;
	/**
	 * Gets the Number value of the node.
	 * @returns the Number value of the node.
	 */
	getNumberValue(): number | undefined;
	/**
	 * Gets the Guid value of the node.
	 * @returns the Guid value of the node.
	 */
	getGuidValue(): Guid | undefined;
	/**
	 * Gets the Date value of the node.
	 * @returns the Date value of the node.
	 */
	getDateValue(): Date | undefined;
	/**
	 * Gets the Duration value of the node.
	 * @returns the Duration value of the node.
	 */
	getDurationValue(): Duration | undefined;
	/**
	 * Gets the DateOnly value of the node.
	 * @returns the DateOnly value of the node.
	 */
	getDateOnlyValue(): DateOnly | undefined;
	/**
	 * Gets the TimeOnly value of the node.
	 * @returns the TimeOnly value of the node.
	 */
	getTimeOnlyValue(): TimeOnly | undefined;
	/**
	 * Gets the collection of primitive values of the node.
	 * @returns the collection of primitive values of the node.
	 */
	getCollectionOfPrimitiveValues<T>(): T[] | undefined;
	/**
	 * Gets the collection of object values of the node.
	 * @returns the collection of object values of the node.
	 */
	getCollectionOfObjectValues<T extends Parsable>(parsableFactory: ParsableFactory<T>): T[] | undefined;

	/**
	 * Gets the model object value of the node.
	 * @returns the model object value of the node.
	 */
	getObjectValue<T extends Parsable>(parsableFactory: ParsableFactory<T>): T;

	/**
	 * Gets the Enum values of the node.
	 * @returns the Enum values of the node.
	 */
	getCollectionOfEnumValues<T>(type: any): T[];
	/**
	 * Gets the Enum value of the node.
	 * @returns the Enum value of the node.
	 */
	getEnumValue<T>(type: any): T | undefined;
	/**
	 * Gets the callback called before the node is deserialized.
	 * @returns the callback called before the node is deserialized.
	 */
	onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
	/**
	 * Gets the callback called after the node is deserialized.
	 * @returns the callback called after the node is deserialized.
	 */
	onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
	/**
	 * Gets the byte array value of the node.
	 * @returns the byte array value of the node.
	 */
	getByteArrayValue(): ArrayBuffer | undefined;
}
