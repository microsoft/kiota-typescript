/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type SerializationWriter, type SerializationWriterFactory, BackingStoreFactory } from "@microsoft/kiota-abstractions";

import { MultipartSerializationWriter } from "./multipartSerializationWriter";

export class MultipartSerializationWriterFactory implements SerializationWriterFactory {
	/**
	 * Creates a new instance of the MultipartSerializationWriterFactory
	 * @param {BackingStoreFactory} backingStoreFactory - The factory for creating backing stores
	 */
	constructor(private readonly backingStoreFactory: BackingStoreFactory) {}
	public getValidContentType(): string {
		return "multipart/form-data";
	}
	public getSerializationWriter(contentType: string): SerializationWriter {
		if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		} else if (this.getValidContentType() !== contentType) {
			throw new Error(`expected a ${this.getValidContentType()} content type`);
		}
		return new MultipartSerializationWriter();
	}
}
