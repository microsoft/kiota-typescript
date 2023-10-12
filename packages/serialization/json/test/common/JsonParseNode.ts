import { assert } from "chai";

import { JsonParseNode } from "../../src/index";
import {
  createTestParserFromDiscriminatorValue,
  TestBackedModel,
  createTestBackedModelFromDiscriminatorValue,
  type TestParser 
} from "./testEntity";

describe("JsonParseNode", () => {
  it("jsonParseNode:initializes", async () => {
    const jsonParseNode = new JsonParseNode(null);
    assert.isDefined(jsonParseNode);
  });

  it("Test object creation", async () => {
    const result = new JsonParseNode(null).getObjectValue(
      createTestParserFromDiscriminatorValue
    );
    assert.isDefined(result);

    const stringValueResult = new JsonParseNode({
      testCollection: ["2", "3"],
      testString: "test",
      additionalProperty: "addnProp",
    }).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
    assert.equal(stringValueResult.testCollection?.length, 2);
    assert.equal(stringValueResult.testCollection?.shift(), "2");
  });

  it("Test date value hydration", async () => {
    const dateStr = "2023-08-31T00:00:00Z";
    const jsDate = new Date(dateStr);

    const stringValueResult = new JsonParseNode({
      testDate: dateStr
    }).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;

    assert.equal(stringValueResult.testDate?.getTime(), jsDate.getTime());
  });

  it("Test undefined dates staying as undefined", async () => {
    const stringValueResult = new JsonParseNode({
      testDate: undefined
    }).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;

    assert.equal(stringValueResult.testDate, undefined);

  });

  it("Test enum values", async () => {
    enum TestEnum {
      A = "a",
      B = "b",
      C = "c"
    }

    const result = new JsonParseNode([
      "a",
      "b",
      "c"
    ]).getCollectionOfEnumValues(TestEnum) as TestEnum[];
    assert.equal(result.length, 3);
    assert.equal(result.shift(), "a");

    const enumValuesResult = new JsonParseNode([
      "d",
      "b",
      "c"
    ]).getCollectionOfEnumValues(TestEnum) as TestEnum[];
    assert.equal(enumValuesResult.length, 2);
    assert.equal(enumValuesResult.shift(), "b");
  });

  it("Test a null collection of object values", async () => {
    const result = new JsonParseNode({
      "foos": [
          {
            "id": "b089d1f1-e527-4b8a-ba96-094922af6e40",
            "bars": null
          }
      ]
    }).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
    assert.equal(result.foos![0].bars, undefined);
  });

  it("Test collection of object values", async () => {
    const result = new JsonParseNode({
      "foos": [
          {
            "id": "b089d1f1-e527-4b8a-ba96-094922af6e40",
            "bars": [
              {
                "propA": "property A test value",
                "propB": "property B test value",
                "propC": null
              }
            ]
          }
      ]
    }).getObjectValue(createTestParserFromDiscriminatorValue) as TestParser;
    assert.equal(result.foos![0].bars![0].propA, "property A test value");
  });

  it("Test collection of backed object values", async () => {
    const result = new JsonParseNode({
      "foos": [
          {
            "id": "b089d1f1-e527-4b8a-ba96-094922af6e40",
            "bars": [
              {
                "propA": "property A test value",
                "propB": "property B test value",
                "propC": null
              }
            ]
          }
      ]
    }).getObjectValue(createTestBackedModelFromDiscriminatorValue) as TestBackedModel;
    assert.equal(result.foos![0].bars![0].propA, "property A test value");
    const backingStore = result.backingStore;
    result.testString = "test";
    assert.equal(backingStore.get("testString"), "test");
  });

});
