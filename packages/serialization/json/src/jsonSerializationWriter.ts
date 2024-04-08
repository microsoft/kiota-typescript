/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DateOnly, Duration, isUntypedNode, type ModelSerializerFunction, type Parsable, type SerializationWriter, TimeOnly, type UntypedNode, isUntypedBoolean, isUntypedString, isUntypedNull, isUntypedNumber, isUntypedObject, isUntypedArray } from "@microsoft/kiota-abstractions";
import type { Guid } from "guid-typescript";

export class JsonSerializationWriter implements SerializationWriter {
	public writeByteArrayValue(key?: string | undefined, value?: ArrayBuffer | undefined): void {
		if (!value) {
			throw new Error("value cannot be undefined");
		}
		const b64 = Buffer.from(value).toString("base64");
		this.writeStringValue(key, b64);
	}
	private readonly writer: string[] = [];
	private static propertySeparator = `,`;
	public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
	public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
	public onStartObjectSerialization: ((value: Parsable, writer: SerializationWriter) => void) | undefined;
	public writeStringValue = (key?: string, value?: string): void => {
		if (value !== null && value !== undefined) {
			key && this.writePropertyName(key);
			this.writer.push(JSON.stringify(value));
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	private writePropertyName = (key: string): void => {
		this.writer.push(`"${key}":`);
	};
	public writeBooleanValue = (key?: string, value?: boolean): void => {
		if (value !== null && value !== undefined) {
			key && this.writePropertyName(key);
			this.writer.push(`${value}`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeNumberValue = (key?: string, value?: number): void => {
		if (value !== null && value !== undefined) {
			key && this.writePropertyName(key);
			this.writer.push(`${value}`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeGuidValue = (key?: string, value?: Guid): void => {
		if (value) {
			key && this.writePropertyName(key);
			this.writer.push(`"${value}"`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeDateValue = (key?: string, value?: Date): void => this.writeStringValue(key, value?.toISOString());
	public writeDateOnlyValue = (key?: string, value?: DateOnly): void => this.writeStringValue(key, value?.toString());
	public writeTimeOnlyValue = (key?: string, value?: TimeOnly): void => this.writeStringValue(key, value?.toString());
	public writeDurationValue = (key?: string, value?: Duration): void => this.writeStringValue(key, value?.toString());
	public writeNullValue = (key?: string): void => {
		key && this.writePropertyName(key);
		this.writer.push(`null`);
		key && this.writer.push(JsonSerializationWriter.propertySeparator);
	};
	public writeCollectionOfPrimitiveValues = <T>(key?: string, values?: T[]): void => {
		if (values) {
			key && this.writePropertyName(key);
			this.writer.push(`[`);
			values.forEach((v, idx) => {
				this.writeAnyValue(undefined, v);
				idx + 1 < values.length && this.writer.push(JsonSerializationWriter.propertySeparator);
			});
			this.writer.push(`]`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};
	public writeCollectionOfObjectValues = <T extends Parsable>(key: string, values: T[], serializerMethod: ModelSerializerFunction<T>): void => {
		if (values) {
			key && this.writePropertyName(key);
			this.writer.push(`[`);
			values.forEach((v) => {
				this.writeObjectValue(undefined, v, serializerMethod);
				this.writer.push(JsonSerializationWriter.propertySeparator);
			});
			if (values.length > 0) {
				//removing the last separator
				this.writer.pop();
			}
			this.writer.push(`]`);
			key && this.writer.push(JsonSerializationWriter.propertySeparator);
		}
	};

	public writeObjectValue<T extends Parsable>(key: string | undefined, value: T, serializerMethod: ModelSerializerFunction<T>): void {
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
				const value = untypedNode.getValue();
				if (key && value) {
					this.writePropertyName(key);
				}
				value && this.writer.push(`{`);
				for (const key in value) {
					this.writeObjectValue(key, value[key] as unknown as T, serializerMethod);
				}
				if (this.writer.length > 0 && this.writer[this.writer.length - 1] === JsonSerializationWriter.propertySeparator) {
					//removing the last separator
					this.writer.pop();
				}
				value && this.writer.push(`}`);
				key && this.writer.push(JsonSerializationWriter.propertySeparator);
			} else if (isUntypedArray(untypedNode)) {
				if (key) {
					this.writePropertyName(key);
				}
				const value = untypedNode.getValue();
				this.writer.push(`[`);
				value.forEach((v, idx) => {
					this.writeObjectValue(undefined, v as unknown as T, serializerMethod);
					idx + 1 < value.length && this.writer.push(JsonSerializationWriter.propertySeparator);
				});
				if (this.writer.length > 0 && this.writer[this.writer.length - 1] === JsonSerializationWriter.propertySeparator) {
					//removing the last separator
					this.writer.pop();
				}
				this.writer.push(`]`);
				key && this.writer.push(JsonSerializationWriter.propertySeparator);
			} else {
				this.writeAnyValue(key, untypedNode.getValue());
			}
			return; // nothing to do here, the value has been written
		}

		if (key && value) {
			this.writePropertyName(key);
		}
		this.onBeforeObjectSerialization && this.onBeforeObjectSerialization(value as unknown as Parsable);
		value && this.writer.push(`{`);

		this.onStartObjectSerialization && this.onStartObjectSerialization(value as unknown as Parsable, this);
		value && serializerMethod && serializerMethod(this, value);
		this.onAfterObjectSerialization && this.onAfterObjectSerialization(value as unknown as Parsable);

		if (this.writer.length > 0 && this.writer[this.writer.length - 1] === JsonSerializationWriter.propertySeparator) {
			//removing the last separator
			this.writer.pop();
		}
		value && this.writer.push(`}`);

		key && this.writer.push(JsonSerializationWriter.propertySeparator);
	}

	public writeEnumValue = <T>(key?: string | undefined, ...values: (T | undefined)[]): void => {
		if (values.length > 0) {
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

	private convertStringToArrayBuffer = (str: string): ArrayBuffer => {
		const encoder = new TextEncoder();
		const encodedString = encoder.encode(str);
		return encodedString.buffer;
	};

	public writeAdditionalData = (additionalData: Record<string, unknown> | undefined): void => {
		// !value will fail to serialize false and null values which can be valid input
		if (additionalData === undefined) return;
		for (const key in additionalData) {
			this.writeAnyValue(key, additionalData[key]);
		}
	};

	private writeNonParsableObjectValue = (key?: string | undefined, value?: object | undefined) => {
		if (key) {
			this.writePropertyName(key);
		}
		this.writer.push(JSON.stringify(value), JsonSerializationWriter.propertySeparator);
	};
	private writeAnyValue = (key?: string | undefined, value?: unknown | undefined): void => {
		if (value !== undefined && value !== null) {
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
		} else {
			this.writeNullValue(key);
		}
	};
}
