/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
const reverseRecord = (input: Record<PropertyKey, PropertyKey>): Record<PropertyKey, PropertyKey> => {
	const entries = Object.entries(input).map(([key, value]) => [value, key]);
	return Object.fromEntries(entries) as Record<PropertyKey, PropertyKey>;
};

/**
 * Factory to create an UntypedString from a string.
 * @param stringValue The string value to lookup the enum value from.
 * @param originalType The type definition of the enum.
 * @typeparam T The type of the enum.
 * @return The enum value.
 */
export const getEnumValueFromStringValue = <T>(stringValue: string, originalType: Record<PropertyKey, PropertyKey>): T | undefined => {
	const reversed: Record<PropertyKey, PropertyKey> = reverseRecord(originalType);
	return originalType[reversed[stringValue]] as T;
};
