/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, beforeEach, describe, it } from "vitest";
import { JsonParseNode } from "../../src/index";
import { createTestParserFromDiscriminatorValue, type TestBackedModel, createTestBackedModelFromDiscriminatorValue, type TestParser, TestUnionObject, BarResponse } from "./testEntity";
import { UntypedTestEntity, createUntypedTestEntityFromDiscriminatorValue } from "./untypedTestEntiy";
import { BackingStoreFactory, InMemoryBackingStoreFactory, UntypedNode, UntypedObject, isUntypedArray, isUntypedBoolean, isUntypedNode, isUntypedNumber, isUntypedObject, BackingStore } from "@microsoft/kiota-abstractions";

describe("JsonParseNode", () => {
	let backingStoreFactory: BackingStoreFactory;

	beforeEach(() => {
		backingStoreFactory = new InMemoryBackingStoreFactory();
	});

	it("jsonParseNode:initializes", async () => {
		const jsonParseNode = new JsonParseNode(null, backingStoreFactory);
		assert.isDefined(jsonParseNode);
	});

	it("Test object creation", async () => {
		const result = new JsonParseNode(null, backingStoreFactory).getObjectValue(createTestParserFromDiscriminatorValue);
		assert.isDefined(result);

		const stringValueResult = new JsonParseNode(
			{
				testCollection: ["2", "3"],
				testString: "test",
				additionalProperty: "addnProp",
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.equal(stringValueResult.testCollection?.length, 2);
		assert.equal(stringValueResult.testCollection?.shift(), "2");
	});

	it("Test date value hydration", async () => {
		const dateStr = "2023-08-31T00:00:00Z";
		const jsDate = new Date(dateStr);

		const stringValueResult = new JsonParseNode(
			{
				testDate: dateStr,
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;

		assert.equal(stringValueResult.testDate?.getTime(), jsDate.getTime());
	});

	it("Test undefined dates staying as undefined", async () => {
		const stringValueResult = new JsonParseNode(
			{
				testDate: undefined,
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;

		assert.equal(stringValueResult.testDate, undefined);
	});

	it("Test enum values", async () => {
		const TestEnumObject = {
			A: "a",
			B: "b",
			C: "c",
		} as const;

		type TestEnum = (typeof TestEnumObject)[keyof typeof TestEnumObject];

		const result = new JsonParseNode(["a", "b", "c"], backingStoreFactory).getCollectionOfEnumValues(TestEnumObject) as TestEnum[];
		assert.equal(result.length, 3);
		assert.equal(result.shift(), "a");

		const enumValuesResult = new JsonParseNode(["d", "b", "c"], backingStoreFactory).getCollectionOfEnumValues(TestEnumObject) as TestEnum[];
		assert.equal(enumValuesResult.length, 2);
		assert.equal(enumValuesResult.shift(), "b");

		const enumValueResult = new JsonParseNode("a", backingStoreFactory).getEnumValue(TestEnumObject) as TestEnum;
		assert.equal(enumValueResult, TestEnumObject.A);
	});

	it("Test enum values with special or reserved characters", async () => {
		type Test_status = (typeof Test_statusObject)[keyof typeof Test_statusObject];
		const Test_statusObject = {
			IN_PROGRESS: "IN_PROGRESS",
			INPROGRESS: "IN PROGRESS",
			NEW_ESCAPED: "NEW",
		} as const;

		const enumValueResult = new JsonParseNode("NEW", backingStoreFactory).getEnumValue(Test_statusObject) as Test_status;
		assert.equal(enumValueResult, Test_statusObject.NEW_ESCAPED);

		const enumValueResult2 = new JsonParseNode("IN_PROGRESS", backingStoreFactory).getEnumValue(Test_statusObject) as Test_status;
		assert.equal(enumValueResult2, Test_statusObject.IN_PROGRESS);

		const enumValueResult3 = new JsonParseNode("IN PROGRESS", backingStoreFactory).getEnumValue(Test_statusObject) as Test_status;
		assert.equal(enumValueResult3, Test_statusObject.INPROGRESS);
	});

	it("Test an undefined collection of object values", async () => {
		const result = new JsonParseNode(
			{
				foos: [
					{
						id: "b089d1f1-e527-4b8a-ba96-094922af6e40",
						bars: undefined,
					},
				],
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.isUndefined(result.foos![0].bars);
	});

	it("Test null collection of object values", async () => {
		const result = new JsonParseNode(
			{
				foos: [
					{
						id: "b089d1f1-e527-4b8a-ba96-094922af6e40",
						bars: null,
					},
				],
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.isUndefined(result.foos![0].bars);
	});

	it("Test collection of object values", async () => {
		const result = new JsonParseNode(
			{
				foos: [
					{
						id: "b089d1f1-e527-4b8a-ba96-094922af6e40",
						bars: [
							{
								propA: "property A test value",
								propB: "property B test value",
								propC: null,
							},
						],
					},
				],
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.equal(result.foos![0].bars![0].propA, "property A test value");
	});

	it("Test collection of backed object values", async () => {
		const result = new JsonParseNode(
			{
				foos: [
					{
						id: "b089d1f1-e527-4b8a-ba96-094922af6e40",
						bars: [
							{
								propA: "property A test value",
								propB: "property B test value",
								propC: null,
							},
						],
					},
				],
			},
			backingStoreFactory,
		).getObjectValue(createTestBackedModelFromDiscriminatorValue) as TestBackedModel;
		assert.equal(result.foos![0].bars![0].propA, "property A test value");
		const backingStore = result.backingStore;
		result.testString = "test";
		assert.equal(backingStore?.get("testString"), "test");
	});

	it("backing store shouldn't interfere with JSON.stringify", async () => {
		const jsonObject = {
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

		const result = new JsonParseNode(jsonObject, backingStoreFactory).getObjectValue(createTestBackedModelFromDiscriminatorValue) as TestBackedModel;
		assert.equal(result.foos![0].bars![0].propA, "property A test value");
		let jsonObjectStr = JSON.stringify(jsonObject);
		let resultStr = JSON.stringify(result);
		assert.equal(jsonObjectStr, resultStr);

		// update the object then check stringify again
		result.testString = "testStringValue";
		jsonObjectStr = JSON.stringify(jsonObject);
		resultStr = JSON.stringify(result);
		assert.notEqual(jsonObjectStr, resultStr);

		// update the backing store and check stringify again
		const updateTestStrValue = "test string value";
		const backingStore = result.backingStore;
		backingStore?.set("testString", updateTestStrValue);
		const updatedJsonObject = { ...jsonObject, testString: updateTestStrValue };
		jsonObjectStr = JSON.stringify(updatedJsonObject);
		resultStr = JSON.stringify(result);
		assert.equal(jsonObjectStr, resultStr);
	});

	it("untyped nodes are deserialized correctly", async () => {
		const jsonObject = {
			id: "1",
			title: "title",
			location: {
				address: {
					city: "Redmond",
					postalCode: "98052",
					state: "Washington",
					street: "NE 36th St",
				},
				coordinates: {
					latitude: 47.678581,
					longitude: -122.131577,
				},
				displayName: "Microsoft Building 25",
				floorCount: 50,
				hasReception: true,
				contact: null,
			},
			keywords: [
				{
					created: "2023-07-26T10:41:26Z",
					label: "Keyword1",
					termGuid: "10e9cc83-b5a4-4c8d-8dab-4ada1252dd70",
					wssId: 6442450941,
				},
				{
					created: "2023-07-26T10:51:26Z",
					label: "Keyword2",
					termGuid: "2cae6c6a-9bb8-4a78-afff-81b88e735fef",
					wssId: 6442450942,
				},
			],
			extra: {
				value: {
					createdDateTime: {
						value: "2024-01-15T00:00:00+00:00",
					},
				},
			},
			table: [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
			],
		};

		const result = new JsonParseNode(jsonObject, backingStoreFactory).getObjectValue(createUntypedTestEntityFromDiscriminatorValue) as UntypedTestEntity;
		assert.equal(result.id, "1");
		assert.equal(result.title, "title");
		assert.isNotNull(result.location);
		assert.isTrue(isUntypedNode(result.location));
		const location = result.location as UntypedObject;
		const locationProperties = location.getValue();
		assert.isTrue(isUntypedObject(location));
		assert.isTrue(isUntypedObject(locationProperties["address"]));
		assert.isTrue(isUntypedObject(locationProperties["coordinates"]));
		assert.isTrue(isUntypedBoolean(locationProperties["hasReception"]));
		assert.isTrue(isUntypedNumber(locationProperties["floorCount"]));
		assert.isTrue(isUntypedBoolean(locationProperties["hasReception"]));
		assert.equal(locationProperties["hasReception"].getValue(), true);
		assert.equal(locationProperties["contact"].getValue(), null);
		assert.equal(locationProperties["floorCount"].getValue(), 50);
		const keywords = result.keywords as UntypedNode;
		assert.isTrue(isUntypedArray(keywords));
		assert.equal(locationProperties["displayName"].getValue(), "Microsoft Building 25");
		const table = result.table as UntypedNode;
		if (isUntypedArray(table)) {
			table.getValue().forEach((row) => {
				if (isUntypedArray(row)) {
					row.getValue().forEach((cell) => {
						assert.isTrue(isUntypedNumber(cell));
					});
				} else {
					assert.fail("Expected row to be an array");
				}
			});
		} else {
			assert.fail("Expected table to be an array");
		}
	});

	it("should get string value", async () => {
		const testNodeValue = "testStringValue";
		const result = new JsonParseNode(testNodeValue, backingStoreFactory);
		assert.equal(result.getStringValue(), testNodeValue);

		const result2 = new JsonParseNode(true, backingStoreFactory);
		assert.isUndefined(result2.getStringValue());

		const result3 = new JsonParseNode(false, backingStoreFactory);
		assert.isUndefined(result3.getStringValue());

		const result4 = new JsonParseNode(1234, backingStoreFactory);
		assert.isUndefined(result4.getStringValue());
	});

	it("should get number value", async () => {
		const testNodeValue = 12345;
		const result = new JsonParseNode(testNodeValue, backingStoreFactory);
		assert.equal(result.getNumberValue(), testNodeValue);

		const result2 = new JsonParseNode(true, backingStoreFactory);
		assert.isUndefined(result2.getNumberValue());

		const result3 = new JsonParseNode(false, backingStoreFactory);
		assert.isUndefined(result3.getNumberValue());

		const result4 = new JsonParseNode("test value", backingStoreFactory);
		assert.isUndefined(result4.getNumberValue());
	});

	it("should get boolean value", async () => {
		const testNodeValue = true;
		const result = new JsonParseNode(testNodeValue, backingStoreFactory);
		assert.equal(result.getBooleanValue(), testNodeValue);

		const result2 = new JsonParseNode(false, backingStoreFactory);
		assert.equal(result2.getBooleanValue(), false);

		const result3 = new JsonParseNode(123, backingStoreFactory);
		assert.isUndefined(result3.getBooleanValue());

		const result4 = new JsonParseNode("false", backingStoreFactory);
		assert.isUndefined(result4.getBooleanValue());

		const result5 = new JsonParseNode("true", backingStoreFactory);
		assert.isUndefined(result5.getBooleanValue());
	});

	it("should parse a union of objects and primitive values when value is primitive", async () => {
		const result = new JsonParseNode(
			{
				testUnionObject: "Test String Value",
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.equal(result.testUnionObject, "Test String Value");
	});

	it("should parse a union of objects and primitive values when value is an object", async () => {
		const barResponse = {
			propA: "property A test value",
			propB: "property B test value",
			propC: undefined,
		};
		const result = new JsonParseNode(
			{
				testUnionObject: barResponse as TestUnionObject,
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.equal(JSON.stringify(result.testUnionObject), JSON.stringify(barResponse));
	});

	it("should parse a union of objects and primitive values when value is a number", async () => {
		const result = new JsonParseNode(
			{
				testUnionObject: 1234,
			},
			backingStoreFactory,
		).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
		assert.equal(result.testUnionObject, 1234);
	});
});
