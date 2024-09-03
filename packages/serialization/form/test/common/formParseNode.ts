/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { FormParseNode } from "../../src/index";
import { createTestParserFromDiscriminatorValue, type TestEntity } from "../testEntity";

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
		"deviceNames=device1&deviceNames=device2&" + //collection property
		"id=48d31887-5fad-4d73-a9f5-3c356e68a038";
	it("getsEntityValueFromForm", () => {
		const parseNode = new FormParseNode(testUserForm);
		const testEntity = parseNode.getObjectValue(createTestParserFromDiscriminatorValue) as TestEntity;
		assert.isNotNull(testEntity);
		assert.isUndefined(testEntity.officeLocation);
		assert.equal(testEntity.id, "48d31887-5fad-4d73-a9f5-3c356e68a038");
		assert.equal((testEntity as any)["jobTitle"], "Auditor");
		assert.equal(Object.prototype.hasOwnProperty.call(testEntity, "mobilePhone"), false);
		assert.equal(testEntity.workDuration?.toString(), "PT1H");
		assert.equal(2, testEntity.deviceNames?.length);
		assert.equal(testEntity.deviceNames?.[0], "device1");
		assert.equal(testEntity.deviceNames?.[1], "device2");
		assert.equal(testEntity.startWorkTime?.toString(), "08:00:00.0000000");
		assert.equal(testEntity.endWorkTime?.toString(), "17:00:00.0000000");
		assert.equal(testEntity.birthday?.toString(), "2017-09-04");
	});
	it("getCollectionOfObjectValuesFromForm", () => {
		const parseNode = new FormParseNode(testUserForm);
		assert.throw(() => parseNode.getCollectionOfObjectValues(createTestParserFromDiscriminatorValue));
	});
	it("returnsDefaultIfChildNodeDoesNotExist", () => {
		const parseNode = new FormParseNode(testUserForm);
		const imaginaryNode = parseNode.getChildNode("imaginaryNode");
		assert.isUndefined(imaginaryNode);
	});
	it("Test enum values with special or reserved characters", async () => {
		type Test_status = (typeof Test_statusObject)[keyof typeof Test_statusObject];
		const Test_statusObject = {
			IN_PROGRESS: "IN_PROGRESS",
			INPROGRESS: "IN PROGRESS",
			NEW_ESCAPED: "NEW",
		} as const;

		const enumValueResult = new FormParseNode("NEW").getEnumValue(Test_statusObject) as Test_status;
		assert.equal(enumValueResult, Test_statusObject.NEW_ESCAPED);

		const enumValueResult2 = new FormParseNode("IN_PROGRESS").getEnumValue(Test_statusObject) as Test_status;
		assert.equal(enumValueResult2, Test_statusObject.IN_PROGRESS);

		const enumValueResult3 = new FormParseNode("IN PROGRESS").getEnumValue(Test_statusObject) as Test_status;
		assert.equal(enumValueResult3, Test_statusObject.INPROGRESS);
	});
});
