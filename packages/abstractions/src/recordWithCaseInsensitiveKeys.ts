/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

function dictionaryWithCanonicalKeys<V>(canon: (prop: keyof any) => string) {
	const keysNormalizationMap = new Map<string, string>();
	return new Proxy<Record<string, V>>(
		{},
		{
			/**
			 * Intercept the get operation on the dictionary object and forward it to the target object using Reflect.get.
			 */
			get(target, prop) {
				const normalKey = canon(prop);
				return Reflect.get(target, normalKey);
			},
			/**
			 * Intercept the set operation on the dictionary object and forward it to the target object using Reflect.set.
			 */
			set(target, prop, value) {
				const nonNormalKey = prop.toString();
				const normalKey = canon(prop);
				keysNormalizationMap.set(normalKey, nonNormalKey);
				return Reflect.set(target, normalKey, value);
			},
			/**
			 * Intercept the has operation on the dictionary object and forward it to the target object using Reflect.has.
			 */
			has(_, prop) {
				const normalKey = canon(prop);
				return keysNormalizationMap.has(normalKey);
			},
			/**
			 * Intercept the defineProperty operation on the dictionary object and forward it to the target object using Reflect.defineProperty.
			 */
			defineProperty(target, prop, attribs) {
				const nonNormalKey = prop.toString();
				const normalKey = canon(prop);
				keysNormalizationMap.set(normalKey, nonNormalKey);
				return Reflect.defineProperty(target, normalKey, attribs);
			},
			/**
			 * Intercept the deleteProperty operation on the dictionary object and forward it to the target object using Reflect.deleteProperty.
			 */
			deleteProperty(target, prop) {
				const normalKey = canon(prop);
				keysNormalizationMap.delete(normalKey);
				return Reflect.deleteProperty(target, normalKey);
			},
			/**
			 * Intercept the getOwnPropertyDescriptor operation on the dictionary object and forward it to the target object using Reflect.getOwnPropertyDescriptor.
			 */
			getOwnPropertyDescriptor(target, prop) {
				return Reflect.getOwnPropertyDescriptor(target, canon(prop));
			},
			ownKeys() {
				return [...keysNormalizationMap.values()];
			},
		},
	);
}

/**
 * A wrapper for type Record that creates a Record with case insensitive keys
 * @returns A new object that can be used as a dictionary with case-insensitive keys.
 */
export function createRecordWithCaseInsensitiveKeys<T>(): Record<string, T> {
	/**
	 * A function that takes a property name and returns its canonical form.
	 * @param prop The property name to be canonicalized.
	 * @returns The canonical form of the property name.
	 */
	const record: Record<string, T> = dictionaryWithCanonicalKeys<T>((p) => (typeof p === "string" ? p.toLowerCase() : p.toString().toLowerCase()));
	return record;
}
