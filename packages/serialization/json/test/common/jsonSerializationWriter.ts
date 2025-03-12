/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it, beforeEach } from "vitest";

import { JsonParseNode, JsonSerializationWriter } from "../../src/index";
import { createTestBackedModelFromDiscriminatorValue, createTestParserFromDiscriminatorValue, LongRunningOperationStatusObject, serializeTestParser, TestBackedModel, type TestParser } from "./testEntity";
import { UntypedTestEntity, serializeUntypedTestEntity } from "./untypedTestEntity";
import { BackingStore, BackingStoreFactorySingleton, createBackedModelProxyHandler, createUntypedArray, createUntypedBoolean, createUntypedNull, createUntypedNumber, createUntypedObject, createUntypedString } from "@microsoft/kiota-abstractions";

describe("JsonParseNode", () => {
	let backingStoreFactorySingleton: BackingStoreFactorySingleton;
	const dummyBackingStore = {} as BackingStore;

	beforeEach(() => {
		backingStoreFactorySingleton = BackingStoreFactorySingleton.instance;
	});

	it("Test object serialization", async () => {
		const testDate = new Date();
		const inputObject: TestParser = {
			testCollection: ["2", "3"],
			testString: "test",
			testComplexString: "A more \"complex\" string with \r\nlinebreaks and 'weird' characters",
			testObject: {
				additionalData: {
					testObjectName: "str",
					testObjectProp: {
						someValue: 123,
					},
				},
			},
			testDate,
		};

		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.deepEqual(result, {
			testCollection: ["2", "3"],
			testString: "test",
			testComplexString: "A more \"complex\" string with \r\nlinebreaks and 'weird' characters",
			testObject: {
				testObjectName: "str",
				testObjectProp: {
					someValue: 123,
				},
			},
			testDate: testDate.toISOString(),
		});
		const parsedValueResult = new JsonParseNode(result).getObjectValue(createTestParserFromDiscriminatorValue);
		assert.deepEqual(parsedValueResult as object, {
			testCollection: ["2", "3"],
			testString: "test",
			testComplexString: "A more \"complex\" string with \r\nlinebreaks and 'weird' characters",
			testObject: {
				additionalData: {
					testObjectName: "str",
					testObjectProp: {
						someValue: 123,
					},
				},
			},
			testDate: testDate,
		});
	});

	it("Test enum serialization", async () => {
		const inputObject: TestParser = {
			status: LongRunningOperationStatusObject.NotStarted,
			nextStatuses: [LongRunningOperationStatusObject.Succeeded, LongRunningOperationStatusObject.Failed],
		};
		const expectedObject: TestParser = {
			status: LongRunningOperationStatusObject.NotStarted,
			nextStatuses: [LongRunningOperationStatusObject.Succeeded, LongRunningOperationStatusObject.Failed],
		};

		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		const stringValueResult = new JsonParseNode(result).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.deepEqual(stringValueResult, expectedObject);
	});

	it("Test collection of enum serialization", async () => {
		const writer = new JsonSerializationWriter();
		const enums = [LongRunningOperationStatusObject.NotStarted, LongRunningOperationStatusObject.Succeeded];

		writer.writeCollectionOfEnumValues("enum", enums);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		assert.equal(contentAsStr, '"enum":["notStarted","succeeded"],');
	});

	it("encodes characters properly", async () => {
		const inputObject: TestParser = {
			testCollection: ["2", "3"],
			testString: "test",
			testComplexString: "Błonie",
			testObject: {
				additionalData: {
					testObjectName: "str",
					testObjectProp: {
						someValue: 123,
					},
				},
			},
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.equal(result.testComplexString, "Błonie");
	});

	it("serializes null values in json body", async () => {
		const inputObject: TestParser = {
			testCollection: null,
			testString: null,
			testBoolean: null,
			testComplexString: null,
			testObject: null,
			additionalData: {
				extraData: null,
			},
			id: null,
			testDate: null,
			testNumber: null,
			testGuid: null,
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);

		const result = JSON.parse(contentAsStr);

		assert.isNull(result.testCollection);
		assert.isNull(result.testString);
		assert.isNull(result.testComplexString);
		assert.isNull(result.testObject);
		assert.isNull(result.extraData);
		assert.isNull(result.id);
		assert.isNull(result.testDate);
		assert.isNull(result.testNumber);
		assert.isNull(result.testGuid);
	});

	it("skip undefined objects from json body", async () => {
		const inputObject: TestParser = {
			testCollection: undefined,
			testString: "test",
			testObject: undefined,
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isFalse("testCollection" in result);
		assert.isTrue("testString" in result);
		assert.isFalse("testObject" in result);
	});

	it("skip undefined objects from json body boolean value", async () => {
		const inputObject: TestParser = {
			testCollection: undefined,
			testString: "test",
			testObject: undefined,
			testBoolean: false,
			id: "l",
			testNumber: 0,
			testGuid: undefined,
		};

		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);

		assert.isFalse("testCollection" in result);
		assert.isTrue("testString" in result);
		assert.isFalse("testObject" in result);
		assert.isFalse("testGuid" in result);
		assert.isTrue("testBoolean" in result);
		assert.isTrue("id" in result);
	});

	it("skip undefined objects from json body when Backing store enabled", async () => {
		const jsonObject = {
			testCollection: ["2", "3"],
			testString: undefined,
			testNumber: 0,
			testBoolean: false,
			id: "", // empty string are not skipped
			testGuid: "b089d1f1-e527-4b8a-ba96-094922af6e40",
			foos: [
				{
					id: "b089d1f1-e527-4b8a-ba96-094922af6e40",
					bars: [
						{
							propA: "property A test value",
							propB: "property B test value",
						},
					],
				},
			],
		};

		const backedModel: TestBackedModel = new JsonParseNode(jsonObject).getObjectValue(createTestBackedModelFromDiscriminatorValue) as TestBackedModel;

		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", backedModel, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);

		assert.isTrue("testCollection" in result);
		assert.isTrue("foos" in result);
		assert.isFalse("testObject" in result);
		assert.isFalse("testString" in result);
		assert.isTrue("testNumber" in result);
		assert.isTrue("id" in result);
		assert.isTrue("testGuid" in result);

		const handler = createBackedModelProxyHandler<TestBackedModel>();
		const model = new Proxy<TestBackedModel>({ backingStore: dummyBackingStore }, handler);
		model.id = "abc";
		model.testCollection = ["2", "3"];
		model.testString = "test";

		const modelWriter = new JsonSerializationWriter();
		modelWriter.writeObjectValue("", model, serializeTestParser);
		const serializedModelContent = modelWriter.getSerializedContent();
		const modelContentAsString = decoder.decode(serializedModelContent);
		const modelResult = JSON.parse(modelContentAsString);

		assert.isTrue("id" in modelResult);
		assert.isTrue("testCollection" in modelResult);
		assert.isFalse("testObject" in modelResult);
		assert.isTrue("testString" in modelResult);
		// backingStore property shouldn't be part of the serialized content
		assert.isFalse("backingStore:" in modelResult);
	});

	it("serializes untyped nodes as expected", async () => {
		const inputObject: UntypedTestEntity = {
			id: "1",
			title: "title",
			location: createUntypedObject({
				address: createUntypedObject({
					city: createUntypedString("Redmond"),
					postalCode: createUntypedString("98052"),
					state: createUntypedString("Washington"),
					street: createUntypedString("NE 36th St"),
				}),
				coordinates: createUntypedObject({
					latitude: createUntypedNumber(47.678581),
					longitude: createUntypedNumber(-122.131577),
				}),
				displayName: createUntypedString("Microsoft Building 25"),
				floorCount: createUntypedNumber(50),
				hasReception: createUntypedBoolean(true),
				contact: createUntypedNull(),
			}),
			keywords: createUntypedArray([
				createUntypedObject({
					created: createUntypedString("2023-07-26T10:41:26Z"),
					label: createUntypedString("Keyword1"),
					termGuid: createUntypedString("10e9cc83-b5a4-4c8d-8dab-4ada1252dd70"),
					wssId: createUntypedNumber(6442450941),
				}),
				createUntypedObject({
					created: createUntypedString("2023-07-26T10:51:26Z"),
					label: createUntypedString("Keyword2"),
					termGuid: createUntypedString("2cae6c6a-9bb8-4a78-afff-81b88e735fef"),
					wssId: createUntypedNumber(6442450942),
				}),
			]),
			additionalData: {
				extra: createUntypedObject({
					createdDateTime: createUntypedString("2024-01-15T00:00:00+00:00"),
				}),
			},
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeUntypedTestEntity);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		assert.equal(contentAsStr, '{"id":"1","title":"title","location":{"address":{"city":"Redmond","postalCode":"98052","state":"Washington","street":"NE 36th St"},"coordinates":{"latitude":47.678581,"longitude":-122.131577},"displayName":"Microsoft Building 25","floorCount":50,"hasReception":true,"contact":null},"keywords":[{"created":"2023-07-26T10:41:26Z","label":"Keyword1","termGuid":"10e9cc83-b5a4-4c8d-8dab-4ada1252dd70","wssId":6442450941},{"created":"2023-07-26T10:51:26Z","label":"Keyword2","termGuid":"2cae6c6a-9bb8-4a78-afff-81b88e735fef","wssId":6442450942}],"extra":{"value":{"createdDateTime":{"value":"2024-01-15T00:00:00+00:00"}}}}');
	});

	it("it should serialize a union of object and primitive when the value is a string", async () => {
		const inputObject: TestParser = {
			testUnionObject: "Test String value",
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isTrue("testUnionObject" in result);
		assert.equal(result["testUnionObject"], "Test String value");
	});

	it("it should serialize a union of object and primitive when the value is a number", async () => {
		const inputObject: TestParser = {
			testUnionObject: 1234,
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isTrue("testUnionObject" in result);
		assert.equal(result["testUnionObject"], 1234);
	});

	it("it should serialize a union of object and primitive when the value is an object", async () => {
		const barResponse = {
			propA: "property A test value",
			propB: "property B test value",
			propC: undefined,
		};
		const inputObject: TestParser = {
			testUnionObject: barResponse,
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializeTestParser);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isTrue("testUnionObject" in result);
		assert.equal(JSON.stringify(result["testUnionObject"]), JSON.stringify(barResponse));
	});
});
