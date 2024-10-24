/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { type DateOnly, type Duration, MultipartBody, type Parsable, type SerializationWriter, type ModelSerializerFunction, type TimeOnly } from "@microsoft/kiota-abstractions";
import type { Guid } from "guid-typescript";

/** Serialization writer for multipart/form-data */
export class MultipartSerializationWriter implements SerializationWriter {
	public writeByteArrayValue(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		key?: string | undefined,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		value?: ArrayBuffer | undefined,
	): void {
		if (!value) {
			throw new Error("value cannot be undefined");
		}
		const previousValue = this.writer;
		this.writer = new ArrayBuffer(previousValue.byteLength + value.byteLength);
		const pipe = new Uint8Array(this.writer);
		pipe.set(new Uint8Array(previousValue), 0);
		pipe.set(new Uint8Array(value), previousValue.byteLength);
	}
	private writer: ArrayBuffer = new ArrayBuffer(0);
	public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
	public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
	public onStartObjectSerialization: ((value: Parsable, writer: SerializationWriter) => void) | undefined;
	public writeStringValue = (key?: string, value?: string | null): void => {
		if (key) {
			this.writeRawStringValue(key);
		}
		if (value) {
			if (key) {
				this.writeRawStringValue(": ");
			}
			this.writeRawStringValue(value);
		}
	};
	private writeRawStringValue = (value?: string | null): void => {
		if (value) {
			this.writeByteArrayValue(undefined, new TextEncoder().encode(value).buffer);
		}
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeBooleanValue = (key?: string, value?: boolean | null): void => {
		throw new Error(`serialization of boolean values is not supported with multipart`);
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeNumberValue = (key?: string, value?: number | null): void => {
		throw new Error(`serialization of number values is not supported with multipart`);
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeGuidValue = (key?: string, value?: Guid | null): void => {
		throw new Error(`serialization of guid values is not supported with multipart`);
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeDateValue = (key?: string, value?: Date | null): void => {
		throw new Error(`serialization of date values is not supported with multipart`);
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeDateOnlyValue = (key?: string, value?: DateOnly | null): void => {
		throw new Error(`serialization of date only values is not supported with multipart`);
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeTimeOnlyValue = (key?: string, value?: TimeOnly | null): void => {
		throw new Error(`serialization of time only values is not supported with multipart`);
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeDurationValue = (key?: string, value?: Duration | null): void => {
		throw new Error(`serialization of duration values is not supported with multipart`);
	};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public writeNullValue = (key?: string): void => {
		throw new Error(`serialization of null values is not supported with multipart`);
	};
	public writeCollectionOfPrimitiveValues = <T>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_key?: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_values?: T[] | null,
	): void => {
		throw new Error(`serialization of collections is not supported with multipart`);
	};
	public writeCollectionOfObjectValues = <T extends Parsable>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_key?: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_values?: T[] | null,
	): void => {
		throw new Error(`serialization of collections is not supported with multipart`);
	};
	public writeObjectValue = <T extends Parsable>(key: string | undefined, value: T | undefined, serializerMethod: ModelSerializerFunction<T>): void => {
		if (!value) {
			throw new Error(`value cannot be undefined`);
		}
		if (!(value instanceof MultipartBody)) {
			throw new Error(`expected MultipartBody instance`);
		}
		if (!serializerMethod) {
			throw new Error(`serializer method cannot be undefined`);
		}
		this.onBeforeObjectSerialization && this.onBeforeObjectSerialization(value);
		this.onStartObjectSerialization && this.onStartObjectSerialization(value, this);
		serializerMethod(this, value);
		this.onAfterObjectSerialization && this.onAfterObjectSerialization(value);
	};
	public writeEnumValue = <T>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		key?: string | undefined,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		...values: (T | null | undefined)[]
	): void => {
		throw new Error(`serialization of enum values is not supported with multipart`);
	};
	public getSerializedContent = (): ArrayBuffer => {
		return this.writer;
	};

	public writeAdditionalData = (
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		additionalData: Record<string, unknown> | undefined,
	): void => {
		throw new Error(`serialization of additional data is not supported with multipart`);
	};
}
