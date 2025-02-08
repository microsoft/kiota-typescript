/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { DateOnly, Duration, MultipartBody, type RequestAdapter, serializeMultipartBody, TimeOnly } from "@microsoft/kiota-abstractions";
import { JsonSerializationWriterFactory } from "@microsoft/kiota-serialization-json";
import { assert, describe, it } from "vitest";

import { MultipartSerializationWriter } from "../../src";
import { serializeTestEntity, type TestEntity } from "../testEntity";

describe("MultipartSerializationWriter", () => {
	it("throws on parsable serialization", () => {
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
		testEntity.additionalData["createdDateTime"] = new Date(0);
		const multipartSerializationWriter = new MultipartSerializationWriter();
		assert.throw(() => multipartSerializationWriter.writeObjectValue(undefined, testEntity, serializeTestEntity));
	});
	const byteForTest = new Uint8Array([0x01, 0x02, 0x03]);
	it("writes a byte array value", () => {
		const multipartSerializationWriter = new MultipartSerializationWriter();
		multipartSerializationWriter.writeByteArrayValue("key", byteForTest);
		const multipartContent = multipartSerializationWriter.getSerializedContent();
		const multipart = new TextDecoder().decode(multipartContent);
		assert.equal(
			multipart,
			byteForTest
				.toString()
				.split(",")
				.map((x) => String.fromCharCode(parseInt(x)))
				.join(""),
		);
	});
	it("serializes multipart body with correct CRLF delimiters", () => {
		const multipartSerializationWriter = new MultipartSerializationWriter();
		const mpBody = new MultipartBody();
		mpBody.addOrReplacePart("testPart", "text/plain", "test content");
		mpBody.requestAdapter = {
			getSerializationWriterFactory: () => new JsonSerializationWriterFactory(),
		} as RequestAdapter;

		multipartSerializationWriter.writeObjectValue(undefined, mpBody, serializeMultipartBody);
		const multipartContent = multipartSerializationWriter.getSerializedContent();
		const result = new TextDecoder().decode(multipartContent);

		const expectedString = `--${mpBody.getBoundary()}\r\nContent-Type: text/plain\r\nContent-Disposition: form-data; name="testPart"\r\n\r\ntest content\r\n--${mpBody.getBoundary()}--\r\n`;
		assert.equal(result, expectedString);
	});
	it("writes a structured object", () => {
		const testEntity = {} as TestEntity;
		testEntity.id = "48d31887-5fad-4d73-a9f5-3c356e68a038";
		testEntity.workDuration = new Duration({
			months: 1,
		});
		testEntity.startWorkTime = new TimeOnly({
			hours: 8,
		});
		testEntity.birthday = new DateOnly({
			year: 2017,
			month: 9,
			day: 4,
		});
		testEntity.endWorkTime = null;
		testEntity.additionalData = {};
		testEntity.additionalData["mobilePhone"] = null;
		testEntity.additionalData["accountEnabled"] = false;
		testEntity.additionalData["jobTitle"] = "Author";
		testEntity.additionalData["createdDateTime"] = new Date(0);
		const mpBody = new MultipartBody();
		mpBody.addOrReplacePart("image", "application/octet-stream", byteForTest);
		mpBody.addOrReplacePart("testEntity", "application/json", testEntity, serializeTestEntity);
		mpBody.requestAdapter = {
			getSerializationWriterFactory: () => new JsonSerializationWriterFactory(),
		} as RequestAdapter;
		const multipartSerializationWriter = new MultipartSerializationWriter();
		multipartSerializationWriter.writeObjectValue(undefined, mpBody, serializeMultipartBody);
		const multipartContent = multipartSerializationWriter.getSerializedContent();
		const result = new TextDecoder().decode(multipartContent);

		const expectedString = "--" + mpBody.getBoundary() + '\r\nContent-Type: application/octet-stream\r\nContent-Disposition: form-data; name="image"\r\n\r\n' + new TextDecoder().decode(byteForTest) + "\r\n--" + mpBody.getBoundary() + '\r\nContent-Type: application/json\r\nContent-Disposition: form-data; name="testEntity"\r\n\r\n{"id":"48d31887-5fad-4d73-a9f5-3c356e68a038","birthday":"2017-09-04","workDuration":"P1M","startWorkTime":"08:00:00.0000000","endWorkTime":null,"mobilePhone":null,"accountEnabled":false,"jobTitle":"Author","createdDateTime":"1970-01-01T00:00:00.000Z"}\r\n--' + mpBody.getBoundary() + "--\r\n";
		assert.equal(result, expectedString);
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
		const multipartSerializationWriter = new MultipartSerializationWriter();
		assert.throw(() => multipartSerializationWriter.writeCollectionOfObjectValues(undefined, [testEntity]));
	});

	it("serializes Content-Disposition with filename", () => {
		const mpBody = new MultipartBody();
		mpBody.addOrReplacePart("file", "application/octet-stream", byteForTest, undefined, "file.txt");

		const multipartSerializationWriter = new MultipartSerializationWriter();
		multipartSerializationWriter.writeObjectValue(undefined, mpBody, serializeMultipartBody);
		const multipartContent = multipartSerializationWriter.getSerializedContent();
		const result = new TextDecoder().decode(multipartContent);

		const expectedString = "--" + mpBody.getBoundary() + '\r\nContent-Type: application/octet-stream\r\nContent-Disposition: form-data; name="file"; filename="file.txt"\r\n\r\n' + new TextDecoder().decode(byteForTest) + "\r\n--" + mpBody.getBoundary() + "--\r\n";
		assert.equal(result, expectedString);
	});
});
