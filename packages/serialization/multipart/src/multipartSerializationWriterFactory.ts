import type { SerializationWriter, SerializationWriterFactory } from "@microsoft/kiota-abstractions";

import { MultipartSerializationWriter } from "./multipartSerializationWriter";

export class MultipartSerializationWriterFactory implements SerializationWriterFactory {
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
