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
import { SerializationWriterFactoryRegistry } from "./serializationWriterFactoryRegistry";
import { ParseNodeFactoryRegistry } from "./parseNodeFactoryRegistry";

const jsonContentType = "application/json";
/**
 * Serializes a parsable object into a buffer
 * @param serializationWriterFactoryRegistry the serialization writer factory registry
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a buffer containing the serialized value
 */
export function serializeToJson<T extends Parsable>(serializationWriterFactoryRegistry: SerializationWriterFactoryRegistry, value: T, serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
	return serialize(serializationWriterFactoryRegistry, jsonContentType, value, serializationFunction);
}

/**
 * Serializes a parsable object into a string representation
 * @param serializationWriterFactoryRegistry the serialization writer factory registry
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeToJsonAsString<T extends Parsable>(serializationWriterFactoryRegistry: SerializationWriterFactoryRegistry, value: T, serializationFunction: ModelSerializerFunction<T>): string {
	return serializeAsString(serializationWriterFactoryRegistry, jsonContentType, value, serializationFunction);
}

/**
 * Serializes a collection of parsable objects into a buffer
 * @param serializationWriterFactoryRegistry the serialization writer factory registry
 * @param values the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeCollectionToJson<T extends Parsable>(serializationWriterFactoryRegistry: SerializationWriterFactoryRegistry, values: T[], serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
	return serializeCollection(serializationWriterFactoryRegistry, jsonContentType, values, serializationFunction);
}

/**
 * Serializes a collection of parsable objects into a string representation
 * @param serializationWriterFactoryRegistry the serialization writer factory registry
 * @param values the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeCollectionToJsonAsString<T extends Parsable>(serializationWriterFactoryRegistry: SerializationWriterFactoryRegistry, values: T[], serializationFunction: ModelSerializerFunction<T>): string {
	return serializeCollectionAsString(serializationWriterFactoryRegistry, jsonContentType, values, serializationFunction);
}

/**
 * Deserializes a buffer into a parsable object
 * @param parseNodeFactoryRegistry the parse node factory registry
 * @param bufferOrString the value to serialize
 * @param factory the factory for the model type
 * @returns the deserialized parsable object
 */
export function deserializeFromJson<T extends Parsable>(parseNodeFactoryRegistry: ParseNodeFactoryRegistry, bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): Parsable {
	return deserialize(parseNodeFactoryRegistry, jsonContentType, bufferOrString, factory);
}

/**
 * Deserializes a buffer into a collection of parsable object
 * @param parseNodeFactoryRegistry the parse node factory registry
 * @param bufferOrString the value to serialize
 * @param factory the factory for the model type
 * @returns the deserialized collection of parsable objects
 */
export function deserializeCollectionFromJson<T extends Parsable>(parseNodeFactoryRegistry: ParseNodeFactoryRegistry, bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): T[] | undefined {
	return deserializeCollection(parseNodeFactoryRegistry, jsonContentType, bufferOrString, factory);
}
