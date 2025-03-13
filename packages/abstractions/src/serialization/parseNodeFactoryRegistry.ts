/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { ParseNode } from "./parseNode";
import type { ParseNodeFactory } from "./parseNodeFactory";
import { Parsable } from "./parsable";
import type { ParsableFactory } from "./parsableFactory";

/**
 * This factory holds a list of all the registered factories for the various types of nodes.
 */
export class ParseNodeFactoryRegistry implements ParseNodeFactory {
	/**
	 * The content type for JSON data.
	 */
	private readonly jsonContentType = "application/json";

	public getValidContentType(): string {
		throw new Error("The registry supports multiple content types. Get the registered factory instead.");
	}
	/** List of factories that are registered by content type. */
	public contentTypeAssociatedFactories = new Map<string, ParseNodeFactory>();

	/**
	 * Creates a {@link ParseNode} from the given {@link ArrayBuffer} and content type.
	 * @param contentType the content type of the {@link ArrayBuffer}.
	 * @param content the {@link ArrayBuffer} to read from.
	 * @returns a {@link ParseNode} that can deserialize the given {@link ArrayBuffer}.
	 */
	public getRootParseNode(contentType: string, content: ArrayBuffer): ParseNode {
		if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		}
		if (!content) {
			throw new Error("content cannot be undefined or empty");
		}
		const vendorSpecificContentType = contentType.split(";")[0];
		let factory = this.contentTypeAssociatedFactories.get(vendorSpecificContentType);
		if (factory) {
			return factory.getRootParseNode(vendorSpecificContentType, content);
		}
		const cleanedContentType = vendorSpecificContentType.replace(/[^/]+\+/gi, "");
		factory = this.contentTypeAssociatedFactories.get(cleanedContentType);
		if (factory) {
			return factory.getRootParseNode(cleanedContentType, content);
		}
		throw new Error(`Content type ${cleanedContentType} does not have a factory registered to be parsed`);
	}

	/**
	 * Deserializes a buffer into a parsable object
	 * @param bufferOrString the value to serialize
	 * @param factory the factory for the model type
	 * @returns the deserialized parsable object
	 */
	public deserializeFromJson<T extends Parsable>(bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): Parsable {
		return this.deserialize(this.jsonContentType, bufferOrString, factory);
	}

	/**
	 * Deserializes a buffer into a collection of parsable object
	 * @param bufferOrString the value to serialize
	 * @param factory the factory for the model type
	 * @returns the deserialized collection of parsable objects
	 */
	public deserializeCollectionFromJson<T extends Parsable>(bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): T[] | undefined {
		return this.deserializeCollection(this.jsonContentType, bufferOrString, factory);
	}

	/**
	 * Deserializes a buffer into a parsable object
	 * @param contentType the content type to serialize to
	 * @param bufferOrString the value to serialize
	 * @param factory the factory for the model type
	 * @returns the deserialized parsable object
	 */
	public deserialize<T extends Parsable>(contentType: string, bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): Parsable {
		if (typeof bufferOrString === "string") {
			bufferOrString = this.getBufferFromString(bufferOrString);
		}
		const reader = this.getParseNode(contentType, bufferOrString, factory);
		return reader.getObjectValue(factory);
	}
	/**
	 * Deserializes a buffer into a parsable object
	 * @param contentType the content type to serialize to
	 * @param buffer the value to deserialize
	 * @param factory the factory for the model type
	 * @returns the deserialized parsable object
	 */
	private getParseNode(contentType: string, buffer: ArrayBuffer, factory: unknown): ParseNode {
		if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		}
		if (!buffer) {
			throw new Error("buffer cannot be undefined");
		}
		if (!factory) {
			throw new Error("factory cannot be undefined");
		}
		return this.getRootParseNode(contentType, buffer);
	}
	/**
	 * Deserializes a buffer into a collection of parsable object
	 * @param contentType the content type to serialize to
	 * @param bufferOrString the value to serialize
	 * @param factory the factory for the model type
	 * @returns the deserialized collection of parsable objects
	 */
	public deserializeCollection<T extends Parsable>(contentType: string, bufferOrString: ArrayBuffer | string, factory: ParsableFactory<T>): T[] | undefined {
		if (typeof bufferOrString === "string") {
			bufferOrString = this.getBufferFromString(bufferOrString);
		}
		const reader = this.getParseNode(contentType, bufferOrString, factory);
		return reader.getCollectionOfObjectValues(factory);
	}

	/**
	 * Deserializes a buffer into a a collection of parsable object
	 * @param value the string to get a buffer from
	 * @returns the ArrayBuffer representation of the string
	 */
	private getBufferFromString(value: string): ArrayBuffer {
		const encoder = new TextEncoder();
		return encoder.encode(value).buffer;
	}
}
