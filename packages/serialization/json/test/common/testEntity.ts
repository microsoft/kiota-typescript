/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { BackedModel, BackingStore, Guid, Parsable, ParseNode, SerializationWriter } from "@microsoft/kiota-abstractions";

const fakeBackingStore: BackingStore = {} as BackingStore;

export interface TestParser {
	testCollection?: string[] | null | undefined;
	testString?: string | null | undefined;
	testBoolean?: boolean | null | undefined;
	testComplexString?: string | null | undefined;
	testObject?: Record<string, unknown> | null | undefined;
	additionalData?: Record<string, unknown>;
	testDate?: Date | null | undefined;
	foos?: FooResponse[] | undefined;
	id?: string | null | undefined;
	testNumber?: number | null | undefined;
	testGuid?: Guid | null | undefined;
	testUnionObject?: TestUnionObject | null | undefined;
	status?: LongRunningOperationStatus | null;
	nextStatuses?: LongRunningOperationStatus[] | null;
}

export const LongRunningOperationStatusObject = {
	NotStarted: "notStarted",
	Running: "running",
	Succeeded: "succeeded",
	Failed: "failed",
	UnknownFutureValue: "unknownFutureValue",
} as const;
export type LongRunningOperationStatus = (typeof LongRunningOperationStatusObject)[keyof typeof LongRunningOperationStatusObject];

export interface TestBackedModel extends TestParser, BackedModel {
	backingStoreEnabled?: boolean | undefined;
}
export interface FooResponse extends Parsable {
	id?: string | undefined;
	bars?: BarResponse[] | undefined;
}
export interface BarResponse extends Parsable {
	propA?: string | undefined;
	propB?: string | undefined;
	propC?: Date | undefined;
}
export type TestUnionObject = FooResponse | BarResponse | string | number;

export function createTestParserFromDiscriminatorValue(parseNode: ParseNode | undefined) {
	if (!parseNode) throw new Error("parseNode cannot be undefined");
	return deserializeTestParser;
}

export function createTestBackedModelFromDiscriminatorValue(parseNode: ParseNode | undefined) {
	if (!parseNode) throw new Error("parseNode cannot be undefined");
	return deserializeTestBackedModel;
}

export function createFooParserFromDiscriminatorValue(parseNode: ParseNode | undefined) {
	if (!parseNode) throw new Error("parseNode cannot be undefined");
	return deserializeFooParser;
}

export function createBarParserFromDiscriminatorValue(parseNode: ParseNode | undefined) {
	if (!parseNode) throw new Error("parseNode cannot be undefined");
	return deserializeBarParser;
}

export function deserializeTestParser(testParser: TestParser | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		testCollection: (n) => {
			testParser.testCollection = n.getCollectionOfPrimitiveValues();
		},
		testString: (n) => {
			testParser.testString = n.getStringValue();
		},
		testBoolean: (n) => {
			testParser.testBoolean = n.getBooleanValue();
		},
		textComplexString: (n) => {
			testParser.testComplexString = n.getStringValue();
		},
		testDate: (n) => {
			testParser.testDate = n.getDateValue();
		},
		foos: (n) => {
			testParser.foos = n.getCollectionOfObjectValues(createFooParserFromDiscriminatorValue);
		},
		id: (n) => {
			testParser.id = n.getStringValue();
		},
		testNumber: (n) => {
			testParser.testNumber = n.getNumberValue();
		},
		testGuid: (n) => {
			testParser.testGuid = n.getGuidValue();
		},
		testUnionObject: (n) => {
			testParser.testUnionObject = n.getStringValue() ?? n.getNumberValue() ?? n.getObjectValue(createTestUnionObjectFromDiscriminatorValue);
		},
		status: (n) => {
			testParser.status = n.getEnumValue<LongRunningOperationStatus>(LongRunningOperationStatusObject);
		},
		nextStatuses: (n) => {
			testParser.nextStatuses = n.getCollectionOfEnumValues<LongRunningOperationStatus>(LongRunningOperationStatusObject);
		},
	};
}

export function deserializeTestBackedModel(testParser: TestBackedModel | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		backingStoreEnabled: (n) => {
			testParser.backingStoreEnabled = true;
		},
		...deserializeTestParser(testParser),
	};
}

export function deserializeFooParser(fooResponse: FooResponse | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		id: (n) => {
			fooResponse.id = n.getStringValue();
		},
		bars: (n) => {
			fooResponse.bars = n.getCollectionOfObjectValues(createBarParserFromDiscriminatorValue);
		},
	};
}

export function deserializeBarParser(barResponse: BarResponse | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		propA: (n) => {
			barResponse.propA = n.getStringValue();
		},
		propB: (n) => {
			barResponse.propB = n.getStringValue();
		},
		propC: (n) => {
			barResponse.propC = n.getDateValue();
		},
	};
}

export function serializeTestObject(writer: SerializationWriter, entity: { additionalData?: Record<string, unknown> } | undefined = {}): void {
	writer.writeAdditionalData(entity.additionalData);
}
export function serializeTestParser(writer: SerializationWriter, entity: TestParser | undefined = {}): void {
	writer.writeStringValue("id", entity.id);
	writer.writeCollectionOfPrimitiveValues("testCollection", entity.testCollection);
	writer.writeStringValue("testString", entity.testString);
	writer.writeStringValue("testComplexString", entity.testComplexString);
	writer.writeGuidValue("testGuid", entity.testGuid);
	writer.writeDateValue("testDate", entity.testDate);
	writer.writeNumberValue("testNumber", entity.testNumber);
	writer.writeBooleanValue("testBoolean", entity.testBoolean);
	writer.writeObjectValue("testObject", entity.testObject, serializeTestObject);
	writer.writeCollectionOfObjectValues("foos", entity.foos, serializeFoo);
	writer.writeAdditionalData(entity.additionalData);
	if (typeof entity.testUnionObject === "string") {
		writer.writeStringValue("testUnionObject", entity.testUnionObject);
	} else if (typeof entity.testUnionObject === "number") {
		writer.writeNumberValue("testUnionObject", entity.testUnionObject);
	} else {
		writer.writeObjectValue("testUnionObject", entity.testUnionObject as any, serializeTestUnionObject);
	}
	writer.writeEnumValue("status", entity.status);
	writer.writeCollectionOfEnumValues("nextStatuses", entity.nextStatuses);
}

export function serializeFoo(writer: SerializationWriter, entity: FooResponse | undefined = {}): void {
	writer.writeStringValue("id", entity.id);
	writer.writeCollectionOfObjectValues("bars", entity.bars, serializeBar);
}

export function serializeBar(writer: SerializationWriter, entity: BarResponse | undefined = {}): void {
	writer.writeStringValue("propA", entity.propA);
	writer.writeStringValue("propB", entity.propB);
	writer.writeDateValue("propC", entity.propC);
}

export function serializeTestBackModel(writer: SerializationWriter, entity: TestBackedModel | undefined = {}): void {
	serializeTestParser(writer, entity);
}

// Factory Method
export function createTestUnionObjectFromDiscriminatorValue(parseNode: ParseNode | undefined): (instance?: Parsable) => Record<string, (node: ParseNode) => void> {
	return deserializeIntoTestUnionObject;
}

// Deserialization methods
export function deserializeIntoTestUnionObject(fooBar: Partial<TestUnionObject> | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		...deserializeFooParser(fooBar as FooResponse),
		...deserializeBarParser(fooBar as BarResponse),
	};
}

export function serializeTestUnionObject(writer: SerializationWriter, fooBar: Partial<TestUnionObject> | undefined = {}): void {
	serializeFoo(writer, fooBar as FooResponse);
	serializeBar(writer, fooBar as BarResponse);
}
