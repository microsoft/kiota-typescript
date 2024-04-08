import type { BackedModel, BackingStore, Parsable, ParseNode, SerializationWriter } from "@microsoft/kiota-abstractions";
import { Guid } from "guid-typescript";

const fakeBackingStore: BackingStore = {} as BackingStore;

export interface TestParser {
	testCollection?: string[] | undefined;
	testString?: string | undefined;
	testBoolean?: boolean | undefined;
	testComplexString?: string | undefined;
	testObject?: Record<string, unknown> | undefined;
	additionalData?: Record<string, unknown>;
	testDate?: Date | undefined;
	foos?: FooResponse[] | undefined;
	id?: string | undefined;
	testNumber?: number | undefined;
	testGuid?: Guid | undefined;
}
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
