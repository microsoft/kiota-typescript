/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { Parsable } from "./parsable";
import type { ParsableFactory } from "./parsableFactory";
import type { ParseNode } from "./parseNode";
import { ParseNodeFactoryRegistry } from "./parseNodeFactoryRegistry";
import type { ModelSerializerFunction } from "./serializationFunctionTypes";
import type { SerializationWriter } from "./serializationWriter";
import { SerializationWriterFactoryRegistry } from "./serializationWriterFactoryRegistry";

/**
 * Serializes a parsable object into a buffer
 * @param contentType the content type to serialize to
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a buffer containing the serialized value
 */
export function serialize<T extends Parsable>(contentType: string, value: T, serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
	const writer = getSerializationWriter(contentType, value, serializationFunction);
	writer.writeObjectValue(undefined, value, serializationFunction);
	return writer.getSerializedContent();
}
/**
 * Serializes a parsable object into a string representation
 * @param contentType the content type to serialize to
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeToString<T extends Parsable>(contentType: string, value: T, serializationFunction: ModelSerializerFunction<T>): string {
	const buffer = serialize(contentType, value, serializationFunction);
	return getStringValueFromBuffer(buffer);
}
/**
 * Serializes a collection of parsable objects into a buffer
 * @param contentType the content type to serialize to
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeCollection<T extends Parsable>(contentType: string, values: T[], serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
	const writer = getSerializationWriter(contentType, values, serializationFunction);
	writer.writeCollectionOfObjectValues(undefined, values, serializationFunction);
	return writer.getSerializedContent();
}

/**
 * Serializes a collection of parsable objects into a string representation
 * @param contentType the content type to serialize to
 * @param value the value to serialize
 * @param serializationFunction the serialization function for the model type
 * @returns a string representing the serialized value
 */
export function serializeCollectionToString<T extends Parsable>(contentType: string, values: T[], serializationFunction: ModelSerializerFunction<T>): string {
	const buffer = serializeCollection(contentType, values, serializationFunction);
	return getStringValueFromBuffer(buffer);
}

function getSerializationWriter(contentType: string, value: unknown, serializationFunction: unknown): SerializationWriter {
	if (!contentType) {
		throw new Error("content type cannot be undefined or empty");
	}
	if (!value) {
		throw new Error("value cannot be undefined");
	}
	if (!serializationFunction) {
		throw new Error("serializationFunction cannot be undefined");
	}
	return SerializationWriterFactoryRegistry.defaultInstance.getSerializationWriter(contentType);
}

function getStringValueFromBuffer(buffer: ArrayBuffer): string {
	const decoder = new TextDecoder();
	return decoder.decode(buffer);
}

/**
 * Deserializes a buffer into a parsable object
 * @param contentType the content type to serialize to
 * @param bufferOrString the value to serialize
 * @param factory the factory for the model type
 * @returns the deserialized parsable object
 */
export function deserialize<T extends Parsable>(contentType: string, bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): Parsable {
	if (typeof bufferOrString === "string") {
		bufferOrString = getBufferFromString(bufferOrString);
	}
	const reader = getParseNode(contentType, bufferOrString, factory);
	return reader.getObjectValue(factory);
}
function getParseNode(contentType: string, buffer: ArrayBuffer, factory: unknown): ParseNode {
	if (!contentType) {
		throw new Error("content type cannot be undefined or empty");
	}
	if (!buffer) {
		throw new Error("buffer cannot be undefined");
	}
	if (!factory) {
		throw new Error("factory cannot be undefined");
	}
	return ParseNodeFactoryRegistry.defaultInstance.getRootParseNode(contentType, buffer);
}
/**
 * Deserializes a buffer into a a collection of parsable object
 * @param contentType the content type to serialize to
 * @param bufferOrString the value to serialize
 * @param factory the factory for the model type
 * @returns the deserialized collection of parsable objects
 */
export function deserializeCollection<T extends Parsable>(contentType: string, bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): T[] | undefined {
	if (typeof bufferOrString === "string") {
		bufferOrString = getBufferFromString(bufferOrString);
	}
	const reader = getParseNode(contentType, bufferOrString, factory);
	return reader.getCollectionOfObjectValues(factory);
}

function getBufferFromString(value: string): ArrayBuffer {
	const encoder = new TextEncoder();
	return encoder.encode(value).buffer;
}
