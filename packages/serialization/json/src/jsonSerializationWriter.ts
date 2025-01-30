/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DateOnly, Duration, type Guid, isUntypedNode, type ModelSerializerFunction, type Parsable, type SerializationWriter, TimeOnly, type UntypedNode, isUntypedBoolean, isUntypedString, isUntypedNull, isUntypedNumber, isUntypedObject, isUntypedArray, inNodeEnv } from "@microsoft/kiota-abstractions";

export class JsonSerializationWriter implements SerializationWriter {
	public writeByteArrayValue(key?: string, value?: ArrayBuffer): void {
		if (!value) {
			throw new Error("value cannot be undefined");
		}
		const b64 = inNodeEnv() ? Buffer.from(value).toString("base64") : btoa(new TextDecoder().decode(value));
		this.writeStringValue(key, b64);
	}
	private readonly writer: string[] = [];
	private static readonly propertySeparator = `,`;
	private readonly shouldWriteValueOrNull = <T>(key?: string, value?: T | null): boolean => {
		if (value === null) {
			this.writeNullValue(key);
			return false;
		}
		return true;
	};
	public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
	public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
	public onStartObjectSerialization: ((value: Parsable, writer: SerializationWriter) => void) | undefined;
	public writeStringValue = (key?: string, value?: string | null): void => {
		if (value === undefined) {
			return;
		}

		if (this.shouldWriteValueOrNull(key, value)) {
			key && this.writePropertyName(key);
			this.writer.push(JSON.stringify(value));
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	private readonly writePropertyName = (key: string): void => {
		this.writer.push(`"${key}":`);
	};
	public writeBooleanValue = (key?: string, value?: boolean | null): void => {
		if (value === undefined) {
			return;
		}

		if (this.shouldWriteValueOrNull(key, value)) {
			key && this.writePropertyName(key);
			this.writer.push(`${value}`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeNumberValue = (key?: string, value?: number | null): void => {
		if (value === undefined) {
			return;
		}

		if (this.shouldWriteValueOrNull(key, value)) {
			key && this.writePropertyName(key);
			this.writer.push(`${value}`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeGuidValue = (key?: string, value?: Guid | null): void => {
		if (value === undefined) {
			return;
		}

		if (this.shouldWriteValueOrNull(key, value)) {
			key && this.writePropertyName(key);
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			this.writer.push(`"${value}"`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeDateValue = (key?: string, value?: Date | null): void => this.writeStringValue(key, value === null ? null : value?.toISOString());
	public writeDateOnlyValue = (key?: string, value?: DateOnly | null): void => this.writeStringValue(key, value === null ? null : value?.toString());
	public writeTimeOnlyValue = (key?: string, value?: TimeOnly | null): void => this.writeStringValue(key, value === null ? null : value?.toString());
	public writeDurationValue = (key?: string, value?: Duration | null): void => this.writeStringValue(key, value === null ? null : value?.toString());
	public writeNullValue = (key?: string): void => {
		key && this.writePropertyName(key);
		this.writer.push(`null`);
		key && this.writer.push(JsonSerializationWriter.propertySeparator);
	};
	public writeCollectionOfPrimitiveValues = <T>(key?: string, values?: T[] | null): void => {
		if (!this.shouldWriteValueOrNull(key, values)) {
			return;
		}

		if (values) {
			key && this.writePropertyName(key);
			this.startArray();
			values.forEach((v, idx) => {
				this.writeAnyValue(undefined, v);
				idx + 1 < values.length && this.writer.push(JsonSerializationWriter.propertySeparator);
			});
			this.endArray();
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeCollectionOfObjectValues = <T extends Parsable>(key: string, values: T[] | null | undefined, serializerMethod: ModelSerializerFunction<T>): void => {
		if (!this.shouldWriteValueOrNull(key, values)) {
			return;
		}

		if (values) {
			key && this.writePropertyName(key);
			this.startArray();
			values.forEach((v) => {
				this.writeObjectValue(undefined, v, serializerMethod);
				this.writer.push(JsonSerializationWriter.propertySeparator);
			});
			if (values.length > 0) {
				// removing the last separator
				this.writer.pop();
			}
			this.endArray();
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};

	public writeObjectValue<T extends Parsable>(key: string | undefined, value: T | null, serializerMethod: ModelSerializerFunction<T>): void {
		if (value === undefined) {
			return;
		}

		if (!this.shouldWriteValueOrNull(key, value)) {
			return;
		}

		if (isUntypedNode(value)) {
			const untypedNode = value as UntypedNode;
			if (isUntypedBoolean(untypedNode)) {
				this.writeBooleanValue(key, untypedNode.getValue());
			} else if (isUntypedString(untypedNode)) {
				this.writeStringValue(key, untypedNode.getValue());
			} else if (isUntypedNull(untypedNode)) {
				this.writeNullValue(key);
			} else if (isUntypedNumber(untypedNode)) {
				this.writeNumberValue(key, untypedNode.getValue());
			} else if (isUntypedObject(untypedNode)) {
				const objectValue = untypedNode.getValue();
				if (objectValue === undefined) return;
				if (key) this.writePropertyName(key);
				this.startObject();
				for (const vKey in objectValue) {
					if (Object.prototype.hasOwnProperty.call(objectValue, vKey)) {
						this.writeObjectValue(vKey, objectValue[vKey] as unknown as T, serializerMethod);
					}
				}
				this.removeLastSeparator();

				this.endObject();
				if (key) this.writer.push(JsonSerializationWriter.propertySeparator);
			} else if (isUntypedArray(untypedNode)) {
				if (key) {
					this.writePropertyName(key);
				}
				const arrValue = untypedNode.getValue();
				this.startArray();
				arrValue.forEach((v, idx) => {
					this.writeObjectValue(undefined, v as unknown as T, serializerMethod);
					idx + 1 < arrValue.length && this.writer.push(JsonSerializationWriter.propertySeparator);
				});
				this.removeLastSeparator();

				this.endArray();
				key && this.writer.push(JsonSerializationWriter.propertySeparator);
			} else {
				this.writeAnyValue(key, untypedNode.getValue());
			}
			return; // nothing to do here, the value has been written
		}

		if (key) this.writePropertyName(key);

		this.onBeforeObjectSerialization && this.onBeforeObjectSerialization(value as unknown as Parsable);
		this.startObject();

		this.onStartObjectSerialization && this.onStartObjectSerialization(value as unknown as Parsable, this);
		serializerMethod && serializerMethod(this, value);
		this.onAfterObjectSerialization && this.onAfterObjectSerialization(value as unknown as Parsable);

		this.removeLastSeparator();
		this.endObject();

		if (key) this.writer.push(JsonSerializationWriter.propertySeparator);
	}

	private readonly startObject = () => {
		this.writer.push(`{`);
	};
	private readonly endObject = () => {
		this.writer.push(`}`);
	};
	private readonly startArray = () => {
		this.writer.push(`[`);
	};
	private readonly endArray = () => {
		this.writer.push(`]`);
	};

	private readonly removeLastSeparator = () => {
		if (this.writer.length > 0 && this.writer[this.writer.length - 1] === JsonSerializationWriter.propertySeparator) {
			this.writer.pop();
		}
	};

	public writeEnumValue = <T>(key?: string, ...values: (T | undefined | null)[]): void => {
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

	public writeCollectionOfEnumValue = <T>(key?: string, values?: (T | undefined | null)[]): void => {
		if (values && values.length > 0) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			const rawValues = values.filter((x) => x !== undefined).map((x) => `${x}`);

			if (rawValues.length > 0) {
				return;
			}

			key && this.writePropertyName(key);
			this.writer.push(JSON.stringify(rawValues));
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
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
		// !value will fail to serialize false and null values which can be valid input
		if (additionalData === undefined) return;
		for (const key in additionalData) {
			if (Object.prototype.hasOwnProperty.call(additionalData, key)) {
				this.writeAnyValue(key, additionalData[key]);
			}
		}
	};

	private readonly writeNonParsableObjectValue = (key?: string, value?: object) => {
		if (key) {
			this.writePropertyName(key);
		}
		this.writer.push(JSON.stringify(value), JsonSerializationWriter.propertySeparator);
	};
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	private readonly writeAnyValue = (key?: string, value?: unknown | null): void => {
		if (value === undefined) {
			return;
		}

		if (!this.shouldWriteValueOrNull(key, value)) {
			return;
		}

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
		} else if (Array.isArray(value)) {
			this.writeCollectionOfPrimitiveValues(key, value);
		} else if (valueType === "object") {
			this.writeNonParsableObjectValue(key, value as any as object);
		} else {
			throw new Error(`encountered unknown value type during serialization ${valueType}`);
		}
	};
}
