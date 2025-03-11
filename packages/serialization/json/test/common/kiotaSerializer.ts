/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type ModelSerializerFunction, type Parsable, type ParsableFactory, type ParseNode, type ParseNodeFactory, ParseNodeFactoryRegistry, type SerializationWriter, type SerializationWriterFactory, SerializationWriterFactoryRegistry } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { createTestBackedModelFromDiscriminatorValue, serializeTestBackModel, type TestBackedModel } from "./testEntity";
const jsonContentType = "application/json";
describe("kiotaSerializer", () => {
	it("defends serialize", () => {
		const serializationWriterFactoryRegistry = new SerializationWriterFactoryRegistry();
		assert.throws(() => serializationWriterFactoryRegistry.serialize("", undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serialize(jsonContentType, undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serialize(jsonContentType, {} as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeCollection("", undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeCollection(jsonContentType, undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeCollection(jsonContentType, [], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeToString("", undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeToString(jsonContentType, undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeToString(jsonContentType, {} as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeCollectionToString("", undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeCollectionToString(jsonContentType, undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializationWriterFactoryRegistry.serializeCollectionToString(jsonContentType, [], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
	});
	it("defends deserialize", () => {
		const parseNodeFactoryRegistry = new ParseNodeFactoryRegistry();
		assert.throws(() => parseNodeFactoryRegistry.deserialize("", "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => parseNodeFactoryRegistry.deserialize(jsonContentType, "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => parseNodeFactoryRegistry.deserialize(jsonContentType, "{}", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => parseNodeFactoryRegistry.deserializeCollection("", "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => parseNodeFactoryRegistry.deserializeCollection(jsonContentType, "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => parseNodeFactoryRegistry.deserializeCollection(jsonContentType, "{}", undefined as unknown as ParsableFactory<TestBackedModel>));
	});
	it("Serializes an object", () => {
		const serializationWriterFactoryRegistry = new SerializationWriterFactoryRegistry();
		registerMockSerializer(serializationWriterFactoryRegistry, `{"id": "123"}`);
		const testEntity = {
			id: "123",
		} as TestBackedModel;

		const result = serializationWriterFactoryRegistry.serializeToJsonAsString(testEntity, serializeTestBackModel);

		assert.equal(result, `{"id": "123"}`);
	});
	it("Serializes a collection", () => {
		const serializationWriterFactoryRegistry = new SerializationWriterFactoryRegistry();
		registerMockSerializer(serializationWriterFactoryRegistry, `[{"id": "123"}]`);
		const testEntity = {
			id: "123",
		} as TestBackedModel;

		const result = serializationWriterFactoryRegistry.serializeCollectionToJsonAsString([testEntity], serializeTestBackModel);

		assert.equal(result, `[{"id": "123"}]`);
	});
	it("Deserializes an object", () => {
		const parseNodeFactoryRegistry = new ParseNodeFactoryRegistry();
		registerMockParseNode(parseNodeFactoryRegistry, {
			id: "123",
		} as TestBackedModel);
		const result = parseNodeFactoryRegistry.deserializeFromJson(`{"id": "123"}`, createTestBackedModelFromDiscriminatorValue);

		assert.deepEqual(result, {
			id: "123",
		} as TestBackedModel);
	});
	it("Deserializes a collection", () => {
		const parseNodeFactoryRegistry = new ParseNodeFactoryRegistry();
		registerMockParseNode(parseNodeFactoryRegistry, [
			{
				id: "123",
			} as TestBackedModel,
		]);
		const result = parseNodeFactoryRegistry.deserializeFromJson(`[{"id": "123"}]`, createTestBackedModelFromDiscriminatorValue);

		assert.deepEqual(result, [
			{
				id: "123",
			} as TestBackedModel,
		]);
	});
});
function registerMockParseNode(parseNodeFactoryRegistry: ParseNodeFactoryRegistry, value: unknown): void {
	const mockParseNode = {
		getObjectValue<T extends Parsable>(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			parsableFactory: ParsableFactory<T>,
		): T {
			return value as T;
		},
		getCollectionOfObjectValues<T extends Parsable>(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			parsableFactory: ParsableFactory<T>,
		): T[] | undefined {
			return value as T[];
		},
	} as unknown as ParseNode;
	const mockParseNodeFactory = {
		getRootParseNode(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			contentType: string,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			buffer: ArrayBuffer,
		) {
			return mockParseNode;
		},
	} as unknown as ParseNodeFactory;
	parseNodeFactoryRegistry.contentTypeAssociatedFactories.set(jsonContentType, mockParseNodeFactory);
}
function registerMockSerializer(serializationWriterFactoryRegistry: SerializationWriterFactoryRegistry, value: string): void {
	const mockSerializationWriter = {
		getSerializedContent(): ArrayBuffer {
			const encoder = new TextEncoder();
			return encoder.encode(value).buffer;
		},
		writeObjectValue<T extends Parsable>(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			key?: string | undefined,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			value?: T | undefined,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			serializerMethod?: ModelSerializerFunction<T>,
		): void {
			return;
		},
		writeCollectionOfObjectValues<T extends Parsable>(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			key?: string | undefined,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			values?: T[],
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			serializerMethod?: ModelSerializerFunction<T>,
		): void {
			return;
		},
	} as unknown as SerializationWriter;
	const mockSerializationWriterFactory = {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		getSerializationWriter(contentType: string, value: unknown) {
			return mockSerializationWriter;
		},
	} as unknown as SerializationWriterFactory;
	serializationWriterFactoryRegistry.contentTypeAssociatedFactories.set(jsonContentType, mockSerializationWriterFactory);
}
