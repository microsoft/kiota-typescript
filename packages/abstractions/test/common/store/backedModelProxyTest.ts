/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type BackedModel, type BackingStore, BackingStoreFactorySingleton, createBackedModelProxyHandler } from "../../../src/store";
import { assert, describe, it, beforeEach, afterEach } from "vitest";

export interface Model extends BackedModel {
	name?: string;
	age?: number;
}

describe("createBackedModelProxyHandler", () => {
	let backingStoreFactorySingleton: BackingStoreFactorySingleton;
	const fakeBackingStore = {} as BackingStore;

	beforeEach(() => {
		backingStoreFactorySingleton = BackingStoreFactorySingleton.instance;
	});

	afterEach(() => {
		// Reset the backing store factory if required
	});

	it("should get a property from the backing store", () => {
		// Arrange
		const handler = createBackedModelProxyHandler<Model>();
		const model = new Proxy<Model>({ backingStore: fakeBackingStore }, handler);

		// Act
		model.backingStore?.set("name", "Bob");

		// Assert
		assert.equal(model.backingStore?.get("name"), "Bob");
	});

	it("should set a property in the backing store", () => {
		// Arrange
		const handler = createBackedModelProxyHandler<{ name?: string }>();
		const model = new Proxy<Model>({ backingStore: fakeBackingStore }, handler);

		// Act
		model.name = "Bob";

		// Assert
		assert.equal(model.backingStore?.get("name"), "Bob");
	});

	it("should get and set multiple properties in the backing store", () => {
		// Arrange
		const handler = createBackedModelProxyHandler();
		const model = new Proxy<Model>({ backingStore: fakeBackingStore }, handler);

		// Act
		model.name = "Bob";
		model.age = 30;
		const name = model.name;
		const age = model.age;

		// Assert
		assert.equal(model.backingStore?.get("name"), name);
		assert.equal(model.backingStore?.get("age"), age);
	});

	it("should ignore setting the backingStore property", () => {
		// Arrange
		const handler = createBackedModelProxyHandler();
		const model = new Proxy<Model>({ backingStore: fakeBackingStore }, handler);

		// Act
		const dummyBackingStore = {} as BackingStore;
		model.backingStore = dummyBackingStore;

		// Assert
		assert.notEqual(model.backingStore, dummyBackingStore);
	});

	it("should return the backing store when the property itself is backingStore", () => {
		// Arrange
		const handler = createBackedModelProxyHandler();
		const model = new Proxy<Model>({ backingStore: fakeBackingStore }, handler);

		// Act
		const backingStore = model.backingStore;

		// Assert
		assert.isDefined(model.backingStore);
		assert.notEqual(model.backingStore, fakeBackingStore);
	});
});
