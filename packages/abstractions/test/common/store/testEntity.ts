import type { BackedModel, BackingStore, Parsable, ParseNode } from "../../../src";

const fakeBackingStore: BackingStore = {} as BackingStore;

export interface TestParser {
  testString?: string | undefined;
  foos?: FooResponse[] | undefined;
}
export interface TestBackedModel extends TestParser, BackedModel {
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

export function createTestParserFromDiscriminatorValue(
  parseNode: ParseNode | undefined
) {
  if (!parseNode) throw new Error("parseNode cannot be undefined");
  return deserializeTestParser;
}

export function createTestBackedModelFromDiscriminatorValue(
  parseNode: ParseNode | undefined
) {
  if (!parseNode) throw new Error("parseNode cannot be undefined");
  return deserializeTestBackedModel;
}

export function createFooParserFromDiscriminatorValue(
  parseNode: ParseNode | undefined
) {
  if (!parseNode) throw new Error("parseNode cannot be undefined");
  return deserializeFooParser;
}

export function createBarParserFromDiscriminatorValue(
  parseNode: ParseNode | undefined
) {
  if (!parseNode) throw new Error("parseNode cannot be undefined");
  return deserializeBarParser;
}

export function deserializeTestParser(
  testParser: TestParser | undefined = {}
): Record<string, (node: ParseNode) => void> {
  return {
    foos: (n) => {
      testParser.foos = n.getCollectionOfObjectValues(createFooParserFromDiscriminatorValue);
    }
  };
}

export function deserializeTestBackedModel(
  testParser: TestBackedModel | undefined = { backingStore: fakeBackingStore }
): Record<string, (node: ParseNode) => void> {
  return {
    backingStore: (n) => {
      testParser.backingStore = fakeBackingStore;
    },
    foos: (n) => {
      testParser.foos = n.getCollectionOfObjectValues(createFooParserFromDiscriminatorValue);
    }
  };
}

export function deserializeFooParser(
  fooResponse: FooResponse | undefined = {}
): Record<string, (node: ParseNode) => void> {
  return {
    id: (n) => {
      fooResponse.id = n.getStringValue();
    },
    bars: (n) => {
      fooResponse.bars = n.getCollectionOfObjectValues(createBarParserFromDiscriminatorValue);
    }
  };
}

export function deserializeBarParser(
  barResponse: BarResponse | undefined = {}
): Record<string, (node: ParseNode) => void> {
  return {
    propA: (n) => {
      barResponse.propA = n.getStringValue();
    },
    propB: (n) => {
      barResponse.propB = n.getStringValue();
    },
    propC: (n) => {
      barResponse.propC = n.getDateValue();
    }
  };
}
