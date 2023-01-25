import { DateOnly, Duration, TimeOnly } from "@microsoft/kiota-abstractions";
import { assert } from "chai";

import { FormSerializationWriter } from "../../src";
import { serializeTestEntity, TestEntity } from "../testEntity";

describe("FormSerializationWriter", () => {
  it("writesSampleObjectValue", () => {
    const testEntity = {} as TestEntity;
    testEntity.id = "48d31887-5fad-4d73-a9f5-3c356e68a038";
    testEntity.workDuration = new Duration({
      hours: 1,
    });
    testEntity.startWorkTime = new TimeOnly({
      hours: 8,
    });
    testEntity.birthday = new DateOnly({
      year: 2017,
      month: 9,
      day: 4,
    });
    testEntity["mobilePhone"] = null;
    testEntity["accountEnabled"] = false;
    testEntity["jobTitle"] = "Author";
    testEntity["createdDateTime"] = new Date(0);
    const formSerializationWriter = new FormSerializationWriter();
    formSerializationWriter.writeObjectValue(
      undefined,
      testEntity,
      serializeTestEntity
    );
    const formContent = formSerializationWriter.getSerializedContent();
    const form = new TextDecoder().decode(formContent);
    const expectedString =
      "id=48d31887-5fad-4d73-a9f5-3c356e68a038&" +
      "birthday=2017-09-04&" + // Serializes dates
      "workDuration=PT1H&" + // Serializes timespans
      "startWorkTime=08%3A00%3A00.000000000000&" + //Serializes times
      "mobilePhone=null&" + // Serializes null values
      "accountEnabled=false&" +
      "jobTitle=Author&" +
      "createdDateTime=1970-01-01T00%3A00%3A00.000Z";
      console.log("form:");
      console.log(form);
      console.log("form:");
      console.log("expectedString:");
      console.log(expectedString);
      console.log("expectedString:");
    assert.equal(form, expectedString);
  });
  it("writesSampleCollectionOfObjectValues", () => {
    const testEntity = {} as TestEntity;
    testEntity.id = "48d31887-5fad-4d73-a9f5-3c356e68a038";
    testEntity.workDuration = new Duration({
      hours: 1,
    });
    testEntity.startWorkTime = new TimeOnly({
      hours: 8,
    });
    testEntity.birthday = new DateOnly({
      year: 2017,
      month: 9,
      day: 4,
    });
    testEntity["mobilePhone"] = null;
    testEntity["accountEnabled"] = false;
    testEntity["jobTitle"] = "Author";
    testEntity["createdDateTime"] = new Date(0);
    const formSerializationWriter = new FormSerializationWriter();
    assert.throw(() =>
      formSerializationWriter.writeCollectionOfObjectValues(undefined, [
        testEntity,
      ])
    );
  });
});
