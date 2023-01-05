/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  DateOnly,
  Duration,
  Parsable,
  SerializationWriter,
  SerializerMethod,
  TimeOnly,
} from "@microsoft/kiota-abstractions";

export class FormSerializationWriter implements SerializationWriter {
  private readonly writer: string[] = [];
  private static propertySeparator = `&`;
  private depth = -1;
  public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
  public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
  public onStartObjectSerialization:
    | ((value: Parsable, writer: SerializationWriter) => void)
    | undefined;
  public writeStringValue = (key?: string, value?: string): void => {
    if (key && value) {
      this.writePropertyName(key);
      this.writer.push(`=${encodeURIComponent(value)}`);
      this.writer.push(FormSerializationWriter.propertySeparator);
    }
  };
  private writePropertyName = (key: string): void => {
    this.writer.push(encodeURIComponent(key));
  };
  public writeBooleanValue = (key?: string, value?: boolean): void => {
    value !== null &&
      value !== undefined &&
      this.writeStringValue(key, `${value}`);
  };
  public writeNumberValue = (key?: string, value?: number): void => {
    value && this.writeStringValue(key, `${value}`);
  };
  public writeGuidValue = (key?: string, value?: string): void => {
    value && this.writeStringValue(key, value);
  };
  public writeDateValue = (key?: string, value?: Date): void => {
    value && this.writeStringValue(key, value.toISOString());
  };
  public writeDateOnlyValue = (key?: string, value?: DateOnly): void => {
    value && this.writeStringValue(key, value.toString());
  };
  public writeTimeOnlyValue = (key?: string, value?: TimeOnly): void => {
    value && this.writeStringValue(key, value.toString());
  };
  public writeDurationValue = (key?: string, value?: Duration): void => {
    value && this.writeStringValue(key, value.toString());
  };
  public writeNullValue = (key?: string): void => {
    this.writeStringValue(key, `null`);
  };
  public writeCollectionOfPrimitiveValues = <T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _key?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _values?: T[]
  ): void => {
    throw new Error(
      `serialization of collections is not supported with URI encoding`
    );
  };
  public writeCollectionOfObjectValues = <T extends Parsable>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _key?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _values?: T[]
  ): void => {
    throw new Error(
      `serialization of collections is not supported with URI encoding`
    );
  };
  public writeObjectValue = <T extends Parsable>(
    key: string | undefined,
    value: T | undefined,
    serializerMethod: SerializerMethod<T>
  ): void => {
    if (++this.depth > 0) {
      throw new Error(
        `serialization of nested objects is not supported with URI encoding`
      );
    }
    if (value) {
      if (key) {
        this.writePropertyName(key);
      }
      this.onBeforeObjectSerialization &&
        this.onBeforeObjectSerialization(value);
      this.onStartObjectSerialization &&
        this.onStartObjectSerialization(value, this);
      serializerMethod(this, value);
      this.onAfterObjectSerialization && this.onAfterObjectSerialization(value);
      if (
        this.writer.length > 0 &&
        this.writer[this.writer.length - 1] ===
          FormSerializationWriter.propertySeparator
      ) {
        //removing the last separator
        this.writer.pop();
      }
      key && this.writer.push(FormSerializationWriter.propertySeparator);
    }
  };
  public writeEnumValue = <T>(
    key?: string | undefined,
    ...values: (T | undefined)[]
  ): void => {
    if (values.length > 0) {
      const rawValues = values
        .filter((x) => x !== undefined)
        .map((x) => `${x}`);
      if (rawValues.length > 0) {
        this.writeStringValue(
          key,
          rawValues.reduce((x, y) => `${x}, ${y}`)
        );
      }
    }
  };
  public getSerializedContent = (): ArrayBuffer => {
    return this.convertStringToArrayBuffer(this.writer.join(``));
  };

  private convertStringToArrayBuffer = (str: string): ArrayBuffer => {
    const arrayBuffer = new ArrayBuffer(str.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < str.length; i++) {
      uint8Array[i] = str.charCodeAt(i);
    }
    return arrayBuffer;
  };

  public writeAdditionalData = (value: Record<string, unknown>): void => {
    if (!value) return;

    for (const key in value) {
      this.writeAnyValue(key, value[key]);
    }
  };
  private writeAnyValue = (
    key?: string | undefined,
    value?: unknown | undefined
  ): void => {
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
      } else {
        throw new Error(
          `encountered unknown value type during serialization ${valueType}`
        );
      }
    } else {
      this.writeNullValue(key);
    }
  };
}
