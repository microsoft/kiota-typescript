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
import type { ModelSerializerFunction } from "./serializationFunctionTypes";

/** Defines an interface for serialization of objects to a stream. */
export interface SerializationWriter {
	/**
	 * Writes the specified byte array value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeByteArrayValue(key?: string | undefined, value?: ArrayBuffer): void;
	/**
	 * Writes the specified string value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeStringValue(key?: string | undefined, value?: string | null | undefined): void;
	/**
	 * Writes the specified boolean value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeBooleanValue(key?: string | undefined, value?: boolean | null | undefined): void;
	/**
	 * Writes the specified number value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeNumberValue(key?: string | undefined, value?: number | null | undefined): void;
	/**
	 * Writes the specified Guid value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeGuidValue(key?: string | undefined, value?: Guid | null | undefined): void;
	/**
	 * Writes the specified Date value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeDateValue(key?: string | undefined, value?: Date | null | undefined): void;
	/**
	 * Writes the specified Duration value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeDurationValue(key?: string | undefined, value?: Duration | null | undefined): void;
	/**
	 * Writes the specified TimeOnly value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeTimeOnlyValue(key?: string | undefined, value?: TimeOnly | null | undefined): void;
	/**
	 * Writes the specified DateOnly value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeDateOnlyValue(key?: string | undefined, value?: DateOnly | null | undefined): void;
	/**
	 * Writes the specified collection of primitive values to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeCollectionOfPrimitiveValues<T>(key?: string | undefined, values?: T[] | null | undefined): void;
	/**
	 * Writes the specified collection of object values to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeCollectionOfObjectValues<T extends Parsable>(key?: string | undefined, values?: T[] | null, serializerMethod?: ModelSerializerFunction<T>): void;
	/**
	 * Writes the specified model object value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param value the value to write to the stream.
	 */
	writeObjectValue<T extends Parsable>(key?: string | undefined, value?: T | null | undefined, serializerMethod?: ModelSerializerFunction<T>): void;

	/**
	 * Writes the specified enum value to the stream with an optional given key.
	 * @param key the key to write the value with.
	 * @param values the value to write to the stream.
	 */
	writeEnumValue<T>(key?: string | undefined, ...values: (T | null | undefined)[]): void;
	/**
	 * Writes a null value for the specified key.
	 * @param key the key to write the value with.
	 */
	writeNullValue(key?: string | undefined): void;
	/**
	 * Gets the value of the serialized content.
	 * @return the value of the serialized content.
	 */
	getSerializedContent(): ArrayBuffer;
	/**
	 * Writes the specified additional data values to the stream with an optional given key.
	 * @param value the values to write to the stream.
	 */
	writeAdditionalData(value: Record<string, unknown> | undefined): void;
	/**
	 * Gets the callback called before the object gets serialized.
	 * @return the callback called before the object gets serialized.
	 */
	onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
	/**
	 * Gets the callback called after the object gets serialized.
	 * @return the callback called after the object gets serialized.
	 */
	onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
	/**
	 * Gets the callback called right after the serialization process starts.
	 * @return the callback called right after the serialization process starts.
	 */
	onStartObjectSerialization: ((value: Parsable, writer: SerializationWriter) => void) | undefined;
}
