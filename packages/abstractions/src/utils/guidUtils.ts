/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { Guid } from "guid-typescript";

/**
 * Parses a string into a Guid object.
 * @param source The source string.
 * @returns The Guid object.
 */
export function parseGuidString(source?: string): Guid | undefined {
	if (source && Guid.isGuid(source)) {
		return Guid.parse(source);
	} else {
		return undefined;
	}
}
