/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { BackingStoreFactorySingleton } from "./backingStoreFactorySingleton";

// A method that creates a ProxyHandler for a generic model T and attaches it to a backing store.
export function createBackedModelProxyHandler<T extends object>(): ProxyHandler<T> {
	// Each model has a backing store that is created by the BackingStoreFactorySingleton
	const backingStore = BackingStoreFactorySingleton.instance.createBackingStore();

	/**
	 * The ProxyHandler for the model.
	 */
	const handler: ProxyHandler<T> = {
		get(_target, prop, _receiver) {
			if (prop === "backingStore") {
				return backingStore;
			}
			return backingStore.get(prop.toString());
		},
		set(target, prop, value, receiver) {
			if (prop === "backingStore") {
				console.warn(`BackingStore - Ignoring attempt to set 'backingStore' property`);
				return true;
			}
			// set the value on the target object as well to allow it to have keys needed for serialization/deserialization
			Reflect.set(target, prop, value, receiver);
			backingStore.set(prop.toString(), value);
			return true;
		},
	};
	return handler;
}
