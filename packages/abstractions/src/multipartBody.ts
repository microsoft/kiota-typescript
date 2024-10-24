/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { Guid } from "guid-typescript";
import type { RequestAdapter } from "./requestAdapter";
import type { ModelSerializerFunction, Parsable, ParseNode, SerializationWriter } from "./serialization";

/**
 * Defines an interface for a multipart body for request or response.
 */
export class MultipartBody implements Parsable {
	private readonly _boundary: string;
	private readonly _parts: Record<string, MultipartEntry> = {};
	public requestAdapter?: RequestAdapter;
	/**
	 * Instantiates a new MultipartBody.
	 */
	public constructor() {
		this._boundary = Guid.create().toString().replace(/-/g, "");
	}
	/**
	 * Adds or replaces a part with the given name, content type and content.
	 * @param partName the name of the part to add or replace.
	 * @param partContentType the content type of the part to add or replace.
	 * @param content the content of the part to add or replace.
	 * @param serializationCallback the serialization callback to use when serializing the part.
	 */
	public addOrReplacePart<T>(partName: string, partContentType: string, content: T, serializationCallback?: ModelSerializerFunction<Parsable>): void {
		if (!partName) throw new Error("partName cannot be undefined");
		if (!partContentType) {
			throw new Error("partContentType cannot be undefined");
		}
		if (!content) throw new Error("content cannot be undefined");
		const normalizePartName = this.normalizePartName(partName);
		this._parts[normalizePartName] = {
			contentType: partContentType,
			content,
			originalName: partName,
			serializationCallback,
		};
	}
	/**
	 * Gets the content of the part with the given name.
	 * @param partName the name of the part to get the content for.
	 * @returns the content of the part with the given name.
	 */
	public getPartValue<T>(partName: string): T | undefined {
		if (!partName) throw new Error("partName cannot be undefined");
		const normalizePartName = this.normalizePartName(partName);
		const candidate = this._parts[normalizePartName];
		if (!candidate) return undefined;
		return candidate.content as T;
	}
	/**
	 * Removes the part with the given name.
	 * @param partName the name of the part to remove.
	 * @returns true if the part was removed, false if it did not exist.
	 */
	public removePart(partName: string): boolean {
		if (!partName) throw new Error("partName cannot be undefined");
		const normalizePartName = this.normalizePartName(partName);
		if (!this._parts[normalizePartName]) return false;
		delete this._parts[normalizePartName];
		return true;
	}
	/**
	 * Gets the boundary used to separate each part.
	 * @returns the boundary value.
	 */
	public getBoundary(): string {
		return this._boundary;
	}

	private normalizePartName(original: string): string {
		return original.toLocaleLowerCase();
	}
	/**
	 * Lists all the parts in the multipart body.
	 * WARNING: meant for internal use only
	 * @returns the list of parts in the multipart body.
	 */
	public listParts(): Record<string, MultipartEntry> {
		return this._parts;
	}
}
interface MultipartEntry {
	contentType: string;
	content: any;
	originalName: string;
	serializationCallback?: ModelSerializerFunction<Parsable>;
}

export const serializeMultipartBody = (writer: SerializationWriter, multipartBody: Partial<MultipartBody> = new MultipartBody()): void => {
	if (!writer) {
		throw new Error("writer cannot be undefined");
	}
	if (!multipartBody) {
		throw new Error("multipartBody cannot be undefined");
	}
	if (!multipartBody.listParts) {
		throw new Error("multipartBody.listParts cannot be undefined");
	}
	if (!multipartBody.getBoundary) {
		throw new Error("multipartBody.getBoundary cannot be undefined");
	}
	const parts = multipartBody.listParts();
	if (Object.keys(parts).length === 0) {
		throw new Error("multipartBody cannot be empty");
	}
	const boundary = multipartBody.getBoundary();
	let first = true;
	for (const partName in parts) {
		if (Object.prototype.hasOwnProperty.call(parts, partName)) {
			if (first) {
				first = false;
			} else {
				writer.writeStringValue(undefined, "\r\n");
			}
			writer.writeStringValue(undefined, "--" + boundary);
			writer.writeStringValue(undefined, "\r\n");
			const part = parts[partName];
			writer.writeStringValue("Content-Type", part.contentType);
			writer.writeStringValue(undefined, "\r\n");
			writer.writeStringValue("Content-Disposition", 'form-data; name="' + part.originalName + '"');
			writer.writeStringValue(undefined, "\r\n");
			writer.writeStringValue(undefined, "\r\n");
			if (typeof part.content === "string") {
				writer.writeStringValue(undefined, part.content);
			} else if (part.content instanceof ArrayBuffer) {
				writer.writeByteArrayValue(undefined, new Uint8Array(part.content));
			} else if (part.content instanceof Uint8Array) {
				writer.writeByteArrayValue(undefined, part.content);
			} else if (part.serializationCallback) {
				if (!multipartBody.requestAdapter) {
					throw new Error("requestAdapter cannot be undefined");
				}
				const serializationWriterFactory = multipartBody.requestAdapter.getSerializationWriterFactory();
				if (!serializationWriterFactory) {
					throw new Error("serializationWriterFactory cannot be undefined");
				}
				const partSerializationWriter = serializationWriterFactory.getSerializationWriter(part.contentType);
				if (!partSerializationWriter) {
					throw new Error("no serialization writer factory for content type: " + part.contentType);
				}
				partSerializationWriter.writeObjectValue(undefined, part.content as Parsable, part.serializationCallback);
				const partContent = partSerializationWriter.getSerializedContent();
				writer.writeByteArrayValue(undefined, new Uint8Array(partContent));
			} else {
				throw new Error("unsupported content type for multipart body: " + typeof part.content);
			}
		}
	}
	writer.writeStringValue(undefined, "\r\n");
	writer.writeStringValue(undefined, "--" + boundary + "--");
	writer.writeStringValue(undefined, "\r\n");
}

export const deserializeIntoMultipartBody = (
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_: Partial<MultipartBody> | undefined = new MultipartBody(),
): Record<string, (node: ParseNode) => void> => {
	throw new Error("Not implemented");
};
export const createMessageFromDiscriminatorValue = (parseNode: ParseNode | undefined) => {
	if (!parseNode) throw new Error("parseNode cannot be undefined");
	return deserializeIntoMultipartBody;
};
