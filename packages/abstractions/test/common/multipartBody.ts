/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { MultipartBody, serializeMultipartBody } from "../../src/multipartBody";
import type { SerializationWriter } from "../../src/serialization";
describe("multipartBody", () => {
	it("implements defensive programming", () => {
		const mpBody = new MultipartBody();
		assert.throws(() => mpBody.addOrReplacePart("", "application/json", "test"), Error, "partName cannot be undefined");
		assert.throws(() => mpBody.addOrReplacePart("test", "", "test"), Error, "partContentType cannot be undefined");
		assert.throws(() => mpBody.addOrReplacePart("test", "application/json", ""), Error, "content cannot be undefined");
		assert.throws(() => mpBody.getPartValue(""), Error, "partName cannot be undefined");
		assert.throws(() => mpBody.removePart(""), Error, "partName cannot be undefined");
		assert.throws(() => serializeMultipartBody(undefined as any as SerializationWriter, mpBody), Error, "writer cannot be undefined");
		assert.throws(() => serializeMultipartBody({} as any as SerializationWriter, undefined as any as MultipartBody), Error, "multipartBody cannot be empty");
	});
	it("requires parts for serialization", () => {
		const mpBody = new MultipartBody();
		assert.throws(() => serializeMultipartBody({} as any as SerializationWriter, mpBody), Error, "multipartBody cannot be empty");
	});
	it("adds parts", () => {
		const mpBody = new MultipartBody();
		mpBody.addOrReplacePart("test", "application/json", "test");
		assert.strictEqual(mpBody.getPartValue("test"), "test");
		mpBody.addOrReplacePart("test", "application/json", "test2");
		assert.strictEqual(mpBody.getPartValue("test"), "test2");
	});
	it("removes parts", () => {
		const mpBody = new MultipartBody();
		mpBody.addOrReplacePart("test", "application/json", "test");
		assert.strictEqual(mpBody.getPartValue("test"), "test");
		mpBody.removePart("test");
		assert.strictEqual(mpBody.getPartValue("test"), undefined);
	});
	//serialize method is tested in the serialization library
});

describe("multipartBody with fileName", () => {
	const arrayBuffer = new Uint8Array([0x01, 0x01, 0x01]);
	const arrayBuffer2 = new Uint8Array([0x02, 0x02, 0x02]);

	it("adds parts with a filename", () => {
		const mpBody = new MultipartBody();
		mpBody.addOrReplacePart("filepart", "application/octet-stream", arrayBuffer, undefined, "file.txt");

		const part = mpBody.listParts()["filepart"];
		assert.exists(part);
		assert.strictEqual(part.contentType, "application/octet-stream");
		assert.strictEqual(part.content, arrayBuffer);
		assert.strictEqual(part.fileName, "file.txt");
	});

	it("updates filename when replacing a part", () => {
		const mpBody = new MultipartBody();
		mpBody.addOrReplacePart("filepart", "application/octet-stream", arrayBuffer, undefined, "file.txt");
		mpBody.addOrReplacePart("filepart", "application/pdf", arrayBuffer2, undefined, "document.pdf");

		const part = mpBody.listParts()["filepart"];
		assert.exists(part);
		assert.strictEqual(part.fileName, "document.pdf");
		assert.strictEqual(part.content, arrayBuffer2);
		assert.strictEqual(part.contentType, "application/pdf");
	});
});
