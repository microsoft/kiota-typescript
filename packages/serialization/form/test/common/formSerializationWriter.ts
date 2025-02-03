/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { DateOnly, Duration, TimeOnly } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { FormSerializationWriter } from "../../src";
import { LongRunningOperationStatusObject, serializeTestEntity, type TestEntity } from "../testEntity";

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
		testEntity.officeLocation = null;
		testEntity.endWorkTime = null;
		testEntity.additionalData = {};
		testEntity.additionalData["mobilePhone"] = null;
		testEntity.additionalData["accountEnabled"] = false;
		testEntity.additionalData["jobTitle"] = "Author";
		testEntity.additionalData["createdDateTime"] = new Date(0);
		testEntity.deviceNames = ["device1", "device2"];
		testEntity.status = LongRunningOperationStatusObject.NotStarted;
		//testEntity.nextStatuses = [LongRunningOperationStatusObject.Running, LongRunningOperationStatusObject.Succeeded];
		const formSerializationWriter = new FormSerializationWriter();
		formSerializationWriter.writeObjectValue(undefined, testEntity, serializeTestEntity);
		const formContent = formSerializationWriter.getSerializedContent();
		const form = new TextDecoder().decode(formContent);
		const expectedString = [
			"id=48d31887-5fad-4d73-a9f5-3c356e68a038",
			"birthday=2017-09-04", // Serializes dates
			"workDuration=PT1H", // Serializes timespans
			"startWorkTime=08%3A00%3A00.0000000", //Serializes times
			"mobilePhone=null", // Serializes null values in additionalData
			"accountEnabled=false",
			"jobTitle=Author",
			"createdDateTime=1970-01-01T00%3A00%3A00.000Z",
			"deviceNames=device1",
			"deviceNames=device2", // Serializes collections
			"officeLocation=null", // Serializes null values
			"endWorkTime=null", // Serializes null values
			"status=notStarted", // Serializes enum values
		];
		const arr = form.split("&");
		let count = 0;
		expectedString.forEach((expected) => {
			const index = arr.indexOf(expected);
			if (index >= 0) {
				arr.splice(index, 1);
				count++;
			}
		});
		assert.equal(expectedString.length, count);
		assert.equal(arr.length, 0);
	});

	it("writeCollectionOfEnumValues", () => {
		const enums = [LongRunningOperationStatusObject.Running, LongRunningOperationStatusObject.Succeeded];
		const formSerializationWriter = new FormSerializationWriter();
		formSerializationWriter.writeCollectionOfEnumValue("nextStatuses", enums);
		const formContent = formSerializationWriter.getSerializedContent();
		const form = new TextDecoder().decode(formContent);
		assert.equal("nextStatuses=running&nextStatuses=succeeded&", form);
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
		testEntity.additionalData = {};
		testEntity.additionalData["mobilePhone"] = null;
		testEntity.additionalData["accountEnabled"] = false;
		testEntity.additionalData["jobTitle"] = "Author";
		testEntity["createdDateTime"] = new Date(0);
		const formSerializationWriter = new FormSerializationWriter();
		assert.throw(() => formSerializationWriter.writeCollectionOfObjectValues(undefined, [testEntity]));
	});
});
