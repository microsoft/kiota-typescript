/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";
import { JsonParseNode, JsonSerializationWriter } from "../../src/index";
import { deepEqual } from "./testUtils";
import { createPetGetResponseFromDiscriminatorValue, deserializeIntoPetGetResponse, PetGetResponse, serializePetGetResponse, type Cat } from "./unionOfObjectsAndPrimitives";

describe("JsonParseNode", () => {
	it("jsonParseNode:initializes", async () => {
		const jsonParseNode = new JsonParseNode(null);
		assert.isDefined(jsonParseNode);
	});

	it("it should successfully parse PetGetResponse when object is a Cat", async () => {
		const cat = {
			name: "fluffy",
			age: 44,
			favoriteToy: "fish",
		};

		const result = new JsonParseNode({ data: cat, request_id: "55" }).getObjectValue(createPetGetResponseFromDiscriminatorValue) as PetGetResponse;
		assert.equal(JSON.stringify(result.data), JSON.stringify(cat));
		assert.equal(result.request_id, "55");
	});

	it("it should successfully parse PetGetResponse when object is a Dog", async () => {
		const dog = {
			name: "Rex",
			age: 88,
			breed: "Husky",
		};

		const result = new JsonParseNode({ data: dog, request_id: "77" }).getObjectValue(createPetGetResponseFromDiscriminatorValue) as PetGetResponse;
		assert.equal(JSON.stringify(result.data), JSON.stringify(dog));
		assert.equal(result.request_id, "77");
	});

	it("it should successfully parse PetGetResponse when object is a number", async () => {
		const result = new JsonParseNode({ data: 11, request_id: "77" }).getObjectValue(createPetGetResponseFromDiscriminatorValue) as PetGetResponse;
		assert.equal(result.data, 11);
		assert.equal(result.request_id, "77");
	});

	it("it should successfully parse PetGetResponse when object is a string", async () => {
		const result = new JsonParseNode({ data: "test string", request_id: "77" }).getObjectValue(createPetGetResponseFromDiscriminatorValue) as PetGetResponse;
		assert.equal(result.data, "test string");
		assert.equal(result.request_id, "77");
	});

	it("it should serializes PetGetResponse when value is Cat", () => {
		const cat = {
			name: "fluffy",
			age: 44,
			favoriteToy: "fish",
		};
		const inputObject: PetGetResponse = {
			data: cat,
			request_id: "77",
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializePetGetResponse);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isTrue(deepEqual(result["data"], inputObject.data));
		assert.isTrue("data" in result);
	});

	it("it should serializes PetGetResponse when value is Dog", () => {
		const dog = {
			name: "Rex",
			age: 44,
			breed: "Husky",
		};
		const inputObject: PetGetResponse = {
			data: dog,
			request_id: "77",
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializePetGetResponse);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isTrue(deepEqual(result["data"], inputObject.data));
		assert.isTrue("data" in result);
	});

	it("it should serializes PetGetResponse when value is string", () => {
		const inputObject: PetGetResponse = {
			data: "test string",
			request_id: "77",
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializePetGetResponse);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isTrue(deepEqual(result, inputObject));
		assert.equal(result["data"], "test string");
		assert.isTrue("data" in result);
	});

	it("it should serializes PetGetResponse when value is number", () => {
		const inputObject: PetGetResponse = {
			data: 44,
			request_id: "77",
		};
		const writer = new JsonSerializationWriter();
		writer.writeObjectValue("", inputObject, serializePetGetResponse);
		const serializedContent = writer.getSerializedContent();
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(serializedContent);
		const result = JSON.parse(contentAsStr);
		assert.isTrue(deepEqual(result, inputObject));
		assert.equal(result["data"], 44);
		assert.isTrue("data" in result);
	});
});
