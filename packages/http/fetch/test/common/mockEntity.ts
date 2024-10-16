/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { Parsable, ParseNode, SerializationWriter } from "@microsoft/kiota-abstractions";

export type MockEntity = Parsable;

export function createMockEntityFromDiscriminatorValue(parseNode: ParseNode | undefined) {
	if (!parseNode) throw new Error("parseNode cannot be undefined");
	return deserializeMockEntity;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deserializeMockEntity(mockEntity: MockEntity | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {};
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export function serializeMessage(writer: SerializationWriter, mockEntity: MockEntity | undefined = {}): void {}
