/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DateOnly, Duration, type Guid, type ModelSerializerFunction, type Parsable, type SerializationWriter, TimeOnly } from "@microsoft/kiota-abstractions";

export class FormSerializationWriter implements SerializationWriter {
	public writeByteArrayValue(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		key?: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		value?: ArrayBuffer | null,
	): void {
		throw new Error("serialization of byt arrays is not supported with URI encoding");
	}
	private readonly writer: string[] = [];
	private static readonly propertySeparator = `&`;
	private depth = -1;
	public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
	public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
	public onStartObjectSerialization: ((value: Parsable, writer: SerializationWriter) => void) | undefined;
	public writeStringValue = (key?: string, value?: string | null): void => {
		if (value === null) {
			value = "null";
		}
		if (key && value) {
			this.writePropertyName(key);
			this.writer.push(`=${encodeURIComponent(value)}`);
			this.writer.push(FormSerializationWriter.propertySeparator);
		}
	};
	private readonly writePropertyName = (key: string): void => {
		this.writer.push(encodeURIComponent(key));
	};
	private readonly shouldWriteValueOrNull = <T>(key?: string, value?: T | null): boolean => {
		if (value === null) {
			this.writeNullValue(key);
			return false;
		}
		return true;
	};
	public writeBooleanValue = (key?: string, value?: boolean | null): void => {
		if (this.shouldWriteValueOrNull(key, value)) {
			value !== undefined && this.writeStringValue(key, `${value}`);
		}
	};
	public writeNumberValue = (key?: string, value?: number | null): void => {
		if (this.shouldWriteValueOrNull(key, value)) {
			value && this.writeStringValue(key, `${value}`);
		}
	};
	public writeGuidValue = (key?: string, value?: Guid | null): void => {
		if (this.shouldWriteValueOrNull(key, value)) {
			value && this.writeStringValue(key, value.toString());
		}
	};
	public writeDateValue = (key?: string, value?: Date | null): void => {
		if (this.shouldWriteValueOrNull(key, value)) {
			value && this.writeStringValue(key, value.toISOString());
		}
	};
	public writeDateOnlyValue = (key?: string, value?: DateOnly | null): void => {
		if (this.shouldWriteValueOrNull(key, value)) {
			value && this.writeStringValue(key, value.toString());
		}
	};
	public writeTimeOnlyValue = (key?: string, value?: TimeOnly | null): void => {
		if (this.shouldWriteValueOrNull(key, value)) {
			value && this.writeStringValue(key, value.toString());
		}
	};
	public writeDurationValue = (key?: string, value?: Duration | null): void => {
		if (this.shouldWriteValueOrNull(key, value)) {
			value && this.writeStringValue(key, value.toString());
		}
	};
	public writeNullValue = (key?: string): void => {
		key && this.writeStringValue(key, null);
	};
	public writeCollectionOfPrimitiveValues = <T>(_key?: string, _values?: T[] | null): void => {
		if (_key && _values) {
			_values.forEach((val) => {
				this.writeAnyValue(_key, val);
			});
		}
	};
	public writeCollectionOfObjectValues = <T extends Parsable>(
		_key?: string,

		_values?: T[] | null,
	): void => {
		throw new Error(`serialization of collections is not supported with URI encoding`);
	};
	public writeObjectValue = <T extends Parsable>(key: string | undefined, value: T | null | undefined, serializerMethod: ModelSerializerFunction<T>): void => {
		if (++this.depth > 0) {
			throw new Error(`serialization of nested objects is not supported with URI encoding`);
		}

		if (!this.shouldWriteValueOrNull(key, value)) {
			return;
		}

		if (value) {
			if (key) {
				this.writePropertyName(key);
			}
			this.onBeforeObjectSerialization && this.onBeforeObjectSerialization(value);
			this.onStartObjectSerialization && this.onStartObjectSerialization(value, this);
			serializerMethod(this, value);
			this.onAfterObjectSerialization && this.onAfterObjectSerialization(value);
			if (this.writer.length > 0 && this.writer[this.writer.length - 1] === FormSerializationWriter.propertySeparator) {
				// removing the last separator
				this.writer.pop();
			}
			key && this.writer.push(FormSerializationWriter.propertySeparator);
		}
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
	public writeCollectionOfEnumValues = <T>(key?: string, values?: (T | null | undefined)[]): void => {
		if (key && values && values.length > 0) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			const rawValues = values.filter((x) => x !== undefined).map((x) => `${x}`);
			if (rawValues.length > 0) {
				this.writeCollectionOfPrimitiveValues<string>(key, rawValues);
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

	public writeAdditionalData = (additionalData: Record<string, unknown> | undefined): void => {
		// Do not use !value here, because value can be `false`.
		if (additionalData === undefined) return;
		// eslint-disable-next-line guard-for-in
		for (const key in additionalData) {
			this.writeAnyValue(key, additionalData[key]);
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	private readonly writeAnyValue = (key?: string, value?: unknown | null): void => {
		if (value === null) {
			return this.writeNullValue(key);
		}

		if (value !== undefined) {
			const valueType = typeof value;
			if (valueType === "boolean") {
				this.writeBooleanValue(key, value as any as boolean);
			} else if (valueType === "string") {
				this.writeStringValue(key, value as any as string);
			} else if (value instanceof Date) {
				this.writeDateValue(key, value as any as Date);
			} else if (value instanceof DateOnly) {
				this.writeDateOnlyValue(key, value as any as DateOnly);
			} else if (value instanceof TimeOnly) {
				this.writeTimeOnlyValue(key, value as any as TimeOnly);
			} else if (value instanceof Duration) {
				this.writeDurationValue(key, value as any as Duration);
			} else if (valueType === "number") {
				this.writeNumberValue(key, value as any as number);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
				throw new Error(`encountered unknown ${value} value type during serialization ${valueType} for key ${key}`);
			}
		}
	};
}
