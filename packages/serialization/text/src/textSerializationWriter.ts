/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { inNodeEnv, type DateOnly, type Duration, type ModelSerializerFunction, type Parsable, type SerializationWriter, type TimeOnly } from "@microsoft/kiota-abstractions";
import type { Guid } from "guid-typescript";

export class TextSerializationWriter implements SerializationWriter {
	public writeByteArrayValue(key?: string, value?: ArrayBuffer | null): void {
		if (!value) {
			throw new Error("value cannot be undefined");
		}
		const b64 = inNodeEnv() ? Buffer.from(value).toString("base64") : btoa(new TextDecoder().decode(value));

		this.writeStringValue(key, b64);
	}
	private static readonly noStructuredDataMessage = "text does not support structured data";
	private readonly writer: string[] = [];
	public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
	public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
	public onStartObjectSerialization: ((value: Parsable, writer: SerializationWriter) => void) | undefined;
	public writeStringValue = (key?: string, value?: string | null): void => {
		if (key || key !== "") {
			throw new Error(TextSerializationWriter.noStructuredDataMessage);
		}
		if (value !== undefined) {
			if (this.writer.length > 0) {
				throw new Error("a value was already written for this serialization writer, text content only supports a single value");
			} else {
				const isNullValue = value === null;
				this.writer.push(isNullValue ? "null" : value);
			}
		}
	};
	public writeBooleanValue = (key?: string, value?: boolean | null): void => {
		if (value !== undefined) {
			this.writeStringValue(key, `${value}`);
		}
	};
	public writeNumberValue = (key?: string, value?: number | null): void => {
		if (value === null) {
			return this.writeNullValue(key);
		}

		if (value) {
			this.writeStringValue(key, `${value}`);
		}
	};
	public writeGuidValue = (key?: string, value?: Guid | null): void => {
		if (value === null) {
			return this.writeNullValue(key);
		}

		if (value) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			this.writeStringValue(key, `"${value}"`);
		}
	};
	public writeDateValue = (key?: string, value?: Date | null): void => {
		if (value === null) {
			return this.writeNullValue(key);
		}

		if (value) {
			this.writeStringValue(key, `"${value.toISOString()}"`);
		}
	};
	public writeDateOnlyValue = (key?: string, value?: DateOnly | null): void => {
		if (value === null) {
			return this.writeNullValue(key);
		}

		if (value) {
			this.writeStringValue(key, `"${value.toString()}"`);
		}
	};
	public writeTimeOnlyValue = (key?: string, value?: TimeOnly | null): void => {
		if (value === null) {
			return this.writeNullValue(key);
		}

		if (value) {
			this.writeStringValue(key, `"${value.toString()}"`);
		}
	};
	public writeDurationValue = (key?: string, value?: Duration | null): void => {
		if (value === null) {
			return this.writeNullValue(key);
		}

		if (value) {
			this.writeStringValue(key, `"${value.toString()}"`);
		}
	};
	public writeNullValue = (key?: string): void => {
		this.writeStringValue(key, `null`);
	};
	public writeCollectionOfPrimitiveValues = <T>(
		key?: string,

		values?: T[] | null,
	): void => {
		throw new Error(TextSerializationWriter.noStructuredDataMessage);
	};
	public writeCollectionOfObjectValues = <T extends Parsable>(
		key?: string,

		values?: T[] | null,
		serializerMethod?: ModelSerializerFunction<T>,
	): void => {
		throw new Error(TextSerializationWriter.noStructuredDataMessage);
	};
	public writeObjectValue = <T extends Parsable>(
		key?: string,

		value?: T | null,
		serializerMethod?: ModelSerializerFunction<T>,
	): void => {
		throw new Error(TextSerializationWriter.noStructuredDataMessage);
	};
	public writeEnumValue = <T>(key?: string, ...values: (T | null | undefined)[]): void => {
		if (values.length > 0) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			const rawValues = values.filter((x) => x !== undefined).map((x) => `${x}`);
			if (rawValues.length > 0) {
				this.writeStringValue(
					key,
					rawValues.reduce((x, y) => `${x}, ${y}`),
				);
			}
		}
	};
	public getSerializedContent = (): ArrayBuffer => {
		return this.convertStringToArrayBuffer(this.writer.join(``));
	};

	private readonly convertStringToArrayBuffer = (str: string): ArrayBuffer => {
		const encoder = new TextEncoder();
		const encodedString = encoder.encode(str);
		return encodedString.buffer;
	};

	public writeAdditionalData = (value: Record<string, unknown> | undefined): void => {
		throw new Error(TextSerializationWriter.noStructuredDataMessage);
	};
}
