/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { deserialize, deserializeCollection, deserializeFromJson, type ModelSerializerFunction, type Parsable, type ParsableFactory, type ParseNode, type ParseNodeFactory, ParseNodeFactoryRegistry, type SerializationWriter, type SerializationWriterFactory, SerializationWriterFactoryRegistry, serialize, serializeCollection, serializeCollectionToJsonAsString, serializeCollectionToString, serializeToJsonAsString, serializeToString } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { createTestBackedModelFromDiscriminatorValue, serializeTestBackModel, type TestBackedModel } from "./testEntity";
const jsonContentType = "application/json";
describe("kiotaSerializer", () => {
	it("defends serialize", () => {
		assert.throws(() => serialize("", undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serialize(jsonContentType, undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serialize(jsonContentType, {} as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeCollection("", undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeCollection(jsonContentType, undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeCollection(jsonContentType, [], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeToString("", undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeToString(jsonContentType, undefined as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeToString(jsonContentType, {} as unknown as Parsable, undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeCollectionToString("", undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeCollectionToString(jsonContentType, undefined as unknown as Parsable[], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
		assert.throws(() => serializeCollectionToString(jsonContentType, [], undefined as unknown as ModelSerializerFunction<TestBackedModel>));
	});
	it("defends deserialize", () => {
		assert.throws(() => deserialize("", "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => deserialize(jsonContentType, "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => deserialize(jsonContentType, "{}", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => deserializeCollection("", "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => deserializeCollection(jsonContentType, "", undefined as unknown as ParsableFactory<TestBackedModel>));
		assert.throws(() => deserializeCollection(jsonContentType, "{}", undefined as unknown as ParsableFactory<TestBackedModel>));
	});
	it("Serializes an object", () => {
		registerMockSerializer(`{"id": "123"}`);
		const testEntity = {
			id: "123",
		} as TestBackedModel;

		const result = serializeToJsonAsString(testEntity, serializeTestBackModel);

		assert.equal(result, `{"id": "123"}`);

		SerializationWriterFactoryRegistry.defaultInstance.contentTypeAssociatedFactories.clear();
	});
	it("Serializes a collection", () => {
		registerMockSerializer(`[{"id": "123"}]`);
		const testEntity = {
			id: "123",
		} as TestBackedModel;

		const result = serializeCollectionToJsonAsString([testEntity], serializeTestBackModel);

		assert.equal(result, `[{"id": "123"}]`);

		SerializationWriterFactoryRegistry.defaultInstance.contentTypeAssociatedFactories.clear();
	});
	it("Deserializes an object", () => {
		registerMockParseNode({
			id: "123",
		} as TestBackedModel);
		const result = deserializeFromJson(`{"id": "123"}`, createTestBackedModelFromDiscriminatorValue);

		assert.deepEqual(result, {
			id: "123",
		} as TestBackedModel);

		ParseNodeFactoryRegistry.defaultInstance.contentTypeAssociatedFactories.clear();
	});
	it("Deserializes a collection", () => {
		registerMockParseNode([
			{
				id: "123",
			} as TestBackedModel,
		]);
		const result = deserializeFromJson(`[{"id": "123"}]`, createTestBackedModelFromDiscriminatorValue);

		assert.deepEqual(result, [
			{
				id: "123",
			} as TestBackedModel,
		]);

		ParseNodeFactoryRegistry.defaultInstance.contentTypeAssociatedFactories.clear();
	});
});
function registerMockParseNode(value: unknown): void {
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
	ParseNodeFactoryRegistry.defaultInstance.contentTypeAssociatedFactories.set(jsonContentType, mockParseNodeFactory);
}
function registerMockSerializer(value: string): void {
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
	SerializationWriterFactoryRegistry.defaultInstance.contentTypeAssociatedFactories.set(jsonContentType, mockSerializationWriterFactory);
}
