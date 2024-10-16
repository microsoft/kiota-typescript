/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { SerializationWriter, SerializationWriterFactory } from "@microsoft/kiota-abstractions";

import { FormSerializationWriter } from "./formSerializationWriter";

export class FormSerializationWriterFactory implements SerializationWriterFactory {
	public getValidContentType(): string {
		return "application/x-www-form-urlencoded";
	}
	public getSerializationWriter(contentType: string): SerializationWriter {
		if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		} else if (this.getValidContentType() !== contentType) {
			throw new Error(`expected a ${this.getValidContentType()} content type`);
		}
		return new FormSerializationWriter();
	}
}
