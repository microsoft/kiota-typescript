import { assert, describe, it } from "vitest";

import { FormParseNode } from "../../src/index";
import { createTestParserFromDiscriminatorValue,type TestEntity } from "../testEntity";

// TODO (musale) fix this test for browser
describe("FormParseNode", () => {
  const testUserForm =
    "displayName=Megan+Bowen&" +
    "numbers=one,two,thirtytwo&" +
    "givenName=Megan&" +
    "accountEnabled=true&" +
    "createdDateTime=2017-07-29T03:07:25Z&" +
    "jobTitle=Auditor&" +
    "mail=MeganB@M365x214355.onmicrosoft.com&" +
    "mobilePhone=null&" +
    "officeLocation=null&" +
    "preferredLanguage=en-US&" +
    "surname=Bowen&" +
    "workDuration=PT1H&" +
    "startWorkTime=08:00:00.0000000&" +
    "endWorkTime=17:00:00.0000000&" +
    "userPrincipalName=MeganB@M365x214355.onmicrosoft.com&" +
    "birthday=2017-09-04&" +
    "deviceNames=device1&deviceNames=device2&"+ //collection property
    "id=48d31887-5fad-4d73-a9f5-3c356e68a038";
  it("getsEntityValueFromForm", () => {
    const parseNode = new FormParseNode(testUserForm);
    const testEntity = parseNode.getObjectValue(
      createTestParserFromDiscriminatorValue
    ) as TestEntity;
    assert.isNotNull(testEntity);
    assert.isUndefined(testEntity.officeLocation);
    assert.equal(testEntity.id, "48d31887-5fad-4d73-a9f5-3c356e68a038");
    assert.equal((testEntity as any)["jobTitle"], "Auditor");
    assert.equal(
      Object.prototype.hasOwnProperty.call(testEntity, "mobilePhone"),
      false
    );
    assert.equal(testEntity.workDuration?.toString(), "PT1H");
    assert.equal(2, testEntity.deviceNames?.length);
    assert.equal(testEntity.deviceNames?.[0], "device1");
    assert.equal(testEntity.deviceNames?.[1], "device2");
    assert.equal(testEntity.startWorkTime?.toString(), "08:00:00.000000000000");
    assert.equal(testEntity.endWorkTime?.toString(), "17:00:00.000000000000");
    assert.equal(testEntity.birthday?.toString(), "2017-09-04");
  });
  it("getCollectionOfObjectValuesFromForm", () => {
    const parseNode = new FormParseNode(testUserForm);
    assert.throw(() =>
      parseNode.getCollectionOfObjectValues(
        createTestParserFromDiscriminatorValue
      )
    );
  });
  it("returnsDefaultIfChildNodeDoesNotExist", () => {
    const parseNode = new FormParseNode(testUserForm);
    const imaginaryNode = parseNode.getChildNode("imaginaryNode");
    assert.isUndefined(imaginaryNode);
  });
});
