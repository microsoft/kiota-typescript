/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { SerializationWriter } from "./serializationWriter";
import type { SerializationWriterFactory } from "./serializationWriterFactory";
import type { Parsable } from "./parsable";
import type { ModelSerializerFunction } from "./serializationFunctionTypes";
import { BackingStoreSerializationWriterProxyFactory } from "../store";
import { ParseNodeFactoryRegistry } from "./parseNodeFactoryRegistry";

/** This factory holds a list of all the registered factories for the various types of nodes. */
export class SerializationWriterFactoryRegistry implements SerializationWriterFactory {
	/**
	 * The content type for JSON data.
	 */
	private readonly jsonContentType = "application/json";

	public getValidContentType(): string {
		throw new Error("The registry supports multiple content types. Get the registered factory instead.");
	}
	/** List of factories that are registered by content type. */
	public contentTypeAssociatedFactories = new Map<string, SerializationWriterFactory>();
	public getSerializationWriter(contentType: string): SerializationWriter {
		if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		}
		const vendorSpecificContentType = contentType.split(";")[0];
		let factory = this.contentTypeAssociatedFactories.get(vendorSpecificContentType);
		if (factory) {
			return factory.getSerializationWriter(vendorSpecificContentType);
		}
		const cleanedContentType = vendorSpecificContentType.replace(/[^/]+\+/gi, "");
		factory = this.contentTypeAssociatedFactories.get(cleanedContentType);
		if (factory) {
			return factory.getSerializationWriter(cleanedContentType);
		}
		throw new Error(`Content type ${cleanedContentType} does not have a factory registered to be serialized`);
	}

	/**
	 * Registers the default serializer to the registry.
	 * @param type the class of the factory to be registered.
	 */
	public registerDefaultSerializer(type: new () => SerializationWriterFactory): void {
		if (!type) throw new Error("Type is required");
		const serializer = new type();
		this.contentTypeAssociatedFactories.set(serializer.getValidContentType(), serializer);
	}

	/**
	 * Enables the backing store on the given serialization factory registry.
	 */
	public enableBackingStoreForSerializationRegistry(): void {
		for (const [k, v] of this.contentTypeAssociatedFactories) {
			if (!(v instanceof BackingStoreSerializationWriterProxyFactory || v instanceof SerializationWriterFactoryRegistry)) {
				this.contentTypeAssociatedFactories.set(k, new BackingStoreSerializationWriterProxyFactory(v));
			}
		}
	}

	/**
	 * Serializes a parsable object into a buffer
	 * @param value the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns a buffer containing the serialized value
	 */
	public serializeToJson<T extends Parsable>(value: T, serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
		return this.serialize(this.jsonContentType, value, serializationFunction);
	}

	/**
	 * Serializes a parsable object into a string representation
	 * @param value the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns a string representing the serialized value
	 */
	public serializeToJsonAsString<T extends Parsable>(value: T, serializationFunction: ModelSerializerFunction<T>): string {
		return this.serializeToString(this.jsonContentType, value, serializationFunction);
	}

	/**
	 * Serializes a collection of parsable objects into a buffer
	 * @param values the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns a string representing the serialized value
	 */
	public serializeCollectionToJson<T extends Parsable>(values: T[], serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
		return this.serializeCollection(this.jsonContentType, values, serializationFunction);
	}

	/**
	 * Serializes a collection of parsable objects into a string representation
	 * @param values the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns a string representing the serialized value
	 */
	public serializeCollectionToJsonAsString<T extends Parsable>(values: T[], serializationFunction: ModelSerializerFunction<T>): string {
		return this.serializeCollectionToString(this.jsonContentType, values, serializationFunction);
	}

	/**
	 * Serializes a parsable object into a buffer
	 * @param contentType the content type to serialize to
	 * @param value the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns a buffer containing the serialized value
	 */
	public serialize<T extends Parsable>(contentType: string, value: T, serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
		const writer = this.getSerializationFactoryWriter(contentType, value, serializationFunction);
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
	public serializeToString<T extends Parsable>(contentType: string, value: T, serializationFunction: ModelSerializerFunction<T>): string {
		const buffer = this.serialize(contentType, value, serializationFunction);
		return this.getStringValueFromBuffer(buffer);
	}
	/**
	 * Serializes a collection of parsable objects into a buffer
	 * @param contentType the content type to serialize to
	 * @param values the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns a string representing the serialized value
	 */
	public serializeCollection<T extends Parsable>(contentType: string, values: T[], serializationFunction: ModelSerializerFunction<T>): ArrayBuffer {
		const writer = this.getSerializationFactoryWriter(contentType, values, serializationFunction);
		writer.writeCollectionOfObjectValues(undefined, values, serializationFunction);
		return writer.getSerializedContent();
	}

	/**
	 * Serializes a collection of parsable objects into a string representation
	 * @param contentType the content type to serialize to
	 * @param values the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns a string representing the serialized value
	 */
	public serializeCollectionToString<T extends Parsable>(contentType: string, values: T[], serializationFunction: ModelSerializerFunction<T>): string {
		const buffer = this.serializeCollection(contentType, values, serializationFunction);
		return this.getStringValueFromBuffer(buffer);
	}

	/**
	 * Gets a serialization writer for a given content type
	 * @param contentType the content type to serialize to
	 * @param value the value to serialize
	 * @param serializationFunction the serialization function for the model type
	 * @returns the serialization writer for the given content type
	 */
	public getSerializationFactoryWriter(contentType: string, value: unknown, serializationFunction: unknown): SerializationWriter {
		if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		}
		if (!value) {
			throw new Error("value cannot be undefined");
		}
		if (!serializationFunction) {
			throw new Error("serializationFunction cannot be undefined");
		}
		return this.getSerializationWriter(contentType);
	}

	/**
	 * Gets a string value from a buffer
	 * @param buffer the buffer to get a string from
	 * @returns the string representation of the buffer
	 */
	public getStringValueFromBuffer(buffer: ArrayBuffer): string {
		const decoder = new TextDecoder();
		return decoder.decode(buffer);
	}

	/**
	 * Enables the backing store on default serialization writers and the given serialization writer.
	 * @param parseNodeFactoryRegistry The parse node factory registry to enable the backing store on.
	 * @param original The serialization writer to enable the backing store on.
	 * @returns A new serialization writer with the backing store enabled.
	 */
	public enableBackingStoreForSerializationWriterFactory = (parseNodeFactoryRegistry: ParseNodeFactoryRegistry, original: SerializationWriterFactory): SerializationWriterFactory => {
		if (!original) throw new Error("Original must be specified");
		let result = original;
		if (original instanceof SerializationWriterFactoryRegistry) {
			original.enableBackingStoreForSerializationRegistry();
		} else {
			result = new BackingStoreSerializationWriterProxyFactory(original);
		}
		this.enableBackingStoreForSerializationRegistry();
		parseNodeFactoryRegistry.enableBackingStoreForParseNodeRegistry();
		return result;
	};
}
