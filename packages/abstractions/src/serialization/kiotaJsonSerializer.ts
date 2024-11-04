/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { deserialize, deserializeCollection, serialize, serializeCollection, serializeCollectionToString as serializeCollectionAsString, serializeToString as serializeAsString } from "./kiotaSerializer";
import type { Parsable } from "./parsable";
import type { ParsableFactory } from "./parsableFactory";
import type { ModelSerializerFunction } from "./serializationFunctionTypes";

const jsonContentType = "application/json";
/**
 * Serializes a parsable object into a buffer
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a buffer containing the serialized value
 */
export function serializeToJson<T extends Parsable>(value: T, serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
	return serialize(jsonContentType, value, serializationFunction);
}

/**
 * Serializes a parsable object into a string representation
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeToJsonAsString<T extends Parsable>(value: T, serializationFunction: ModelSerializerFunction<T>): string {
	return serializeAsString(jsonContentType, value, serializationFunction);
}

/**
 * Serializes a collection of parsable objects into a buffer
 * @param values the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeCollectionToJson<T extends Parsable>(values: T[], serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
	return serializeCollection(jsonContentType, values, serializationFunction);
}

/**
 * Serializes a collection of parsable objects into a string representation
 * @param values the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeCollectionToJsonAsString<T extends Parsable>(values: T[], serializationFunction: ModelSerializerFunction<T>): string {
	return serializeCollectionAsString(jsonContentType, values, serializationFunction);
}

/**
 * Deserializes a buffer into a parsable object
 * @param bufferOrString the value to serialize
 * @param factory the factory for the model type
 * @returns the deserialized parsable object
 */
export function deserializeFromJson<T extends Parsable>(bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): Parsable {
	return deserialize(jsonContentType, bufferOrString, factory);
}

/**
 * Deserializes a buffer into a a collection of parsable object
 * @param bufferOrString the value to serialize
 * @param factory the factory for the model type
 * @returns the deserialized collection of parsable objects
 */
export function deserializeCollectionFromJson<T extends Parsable>(bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): T[] | undefined {
	return deserializeCollection(jsonContentType, bufferOrString, factory);
}
