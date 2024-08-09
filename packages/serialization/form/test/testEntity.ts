/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { AdditionalDataHolder, DateOnly, Duration, Parsable, ParseNode, SerializationWriter, TimeOnly } from "@microsoft/kiota-abstractions";

export interface TestEntity extends Parsable, AdditionalDataHolder {
	id?: string | null;
	birthday?: DateOnly | null;
	createdDateTime?: Date | null;
	workDuration?: Duration | null;
	startWorkTime?: TimeOnly | null;
	endWorkTime?: TimeOnly | null;
	officeLocation?: string | null;
	deviceNames?: string[] | null;
}
export function createTestParserFromDiscriminatorValue(parseNode: ParseNode | undefined) {
	if (!parseNode) throw new Error("parseNode cannot be undefined");
	return deserializeTestEntity;
}

export function deserializeTestEntity(testEntity: TestEntity | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		id: (n) => {
			testEntity.id = n.getStringValue();
		},
		birthday: (n) => {
			testEntity.birthday = n.getDateOnlyValue();
		},
		createdDateTime: (n) => {
			testEntity.createdDateTime = n.getDateValue();
		},
		workDuration: (n) => {
			testEntity.workDuration = n.getDurationValue();
		},
		startWorkTime: (n) => {
			testEntity.startWorkTime = n.getTimeOnlyValue();
		},
		endWorkTime: (n) => {
			testEntity.endWorkTime = n.getTimeOnlyValue();
		},
		officeLocation: (n) => {
			testEntity.officeLocation = n.getStringValue();
		},
		deviceNames: (n) => {
			testEntity.deviceNames = n.getCollectionOfPrimitiveValues();
		},
	};
}

export function serializeTestEntity(writer: SerializationWriter, testEntity: TestEntity | undefined = {}): void {
	writer.writeStringValue("id", testEntity.id);
	writer.writeDateOnlyValue("birthday", testEntity.birthday);
	writer.writeDateValue("createdDateTime", testEntity.createdDateTime);
	writer.writeDurationValue("workDuration", testEntity.workDuration);
	writer.writeTimeOnlyValue("startWorkTime", testEntity.startWorkTime);
	writer.writeTimeOnlyValue("endWorkTime", testEntity.endWorkTime);
	writer.writeStringValue("officeLocation", testEntity.officeLocation);
	writer.writeAdditionalData(testEntity.additionalData);
	writer.writeCollectionOfPrimitiveValues("deviceNames", testEntity.deviceNames);
}
