import { assert } from "chai";

import { FormParseNode } from "../../src/index";
import { createTestEntityFromDiscriminator, TestEntity } from "../testEntity";

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
    "id=48d31887-5fad-4d73-a9f5-3c356e68a038";
  it("getsEntityValueFromForm", () => {
    const parseNode = new FormParseNode(testUserForm);
    const testEntity = parseNode.getObjectValue(
      createTestEntityFromDiscriminator
    ) as TestEntity;
    assert.isNotNull(testEntity);
    assert.isUndefined(testEntity.officeLocation);
    assert.equal(testEntity.id, "48d31887-5fad-4d73-a9f5-3c356e68a038");
    assert.containsAllKeys(testEntity.additionalData, ["jobTitle"]);
    assert.doesNotHaveAllKeys(testEntity.additionalData, ["mobilePhone"]);
    assert.equal(testEntity.additionalData.jobTitle, "Auditor");
    assert.equal(testEntity.workDuration?.toString(), "PT1H");
    assert.equal(testEntity.startWorkTime?.toString(), "08:00:00.000000000000");
    assert.equal(testEntity.endWorkTime?.toString(), "17:00:00.000000000000");
    assert.equal(testEntity.birthday?.toString(), "2017-09-04");
  });
  it("getCollectionOfObjectValuesFromForm", () => {
    const parseNode = new FormParseNode(testUserForm);
    assert.throw(() =>
      parseNode.getCollectionOfObjectValues(createTestEntityFromDiscriminator)
    );
  });
  it("returnsDefaultIfChildNodeDoesNotExist", () => {
    const parseNode = new FormParseNode(testUserForm);
    const imaginaryNode = parseNode.getChildNode("imaginaryNode");
    assert.isUndefined(imaginaryNode);
  });
});
