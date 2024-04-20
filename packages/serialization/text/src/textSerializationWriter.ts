/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DateOnly,
  Duration,
  Guid,
  ModelSerializerFunction,
  Parsable,
  SerializationWriter,
  TimeOnly,
} from "@microsoft/kiota-abstractions";

export class TextSerializationWriter implements SerializationWriter {
  public writeByteArrayValue(
    key?: string | undefined,
    value?: ArrayBuffer | undefined,
  ): void {
    if (!value) {
      throw new Error("value cannot be undefined");
    }
    const b64 = Buffer.from(value).toString("base64");
    this.writeStringValue(key, b64);
  }
  private static noStructuredDataMessage =
    "text does not support structured data";
  private readonly writer: string[] = [];
  public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
  public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
  public onStartObjectSerialization:
    | ((value: Parsable, writer: SerializationWriter) => void)
    | undefined;
  public writeStringValue = (key?: string, value?: string): void => {
    if (key || key !== "") {
      throw new Error(TextSerializationWriter.noStructuredDataMessage);
    }
    if (value) {
      if (this.writer.length > 0) {
        throw new Error(
          "a value was already written for this serialization writer, text content only supports a single value"
        );
      } else {
        this.writer.push(value);
      }
    }
  };
  public writeBooleanValue = (key?: string, value?: boolean): void => {
    if (value !== null && value !== undefined) {
      this.writeStringValue(key, `${value}`);
    }
  };
  public writeNumberValue = (key?: string, value?: number): void => {
    if (value) {
      this.writeStringValue(key, `${value}`);
    }
  };
  public writeGuidValue = (key?: string, value?: Guid): void => {
    if (value) {
      this.writeStringValue(key, `"${value}"`);
    }
  };
  public writeDateValue = (key?: string, value?: Date): void => {
    if (value) {
      this.writeStringValue(key, `"${value.toISOString()}"`);
    }
  };
  public writeDateOnlyValue = (key?: string, value?: DateOnly): void => {
    if (value) {
      this.writeStringValue(key, `"${value.toString()}"`);
    }
  };
  public writeTimeOnlyValue = (key?: string, value?: TimeOnly): void => {
    if (value) {
      this.writeStringValue(key, `"${value.toString()}"`);
    }
  };
  public writeDurationValue = (key?: string, value?: Duration): void => {
    if (value) {
      this.writeStringValue(key, `"${value.toString()}"`);
    }
  };
  public writeNullValue = (key?: string): void => {
    this.writeStringValue(key, `null`);
  };
  public writeCollectionOfPrimitiveValues = <T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    values?: T[]
  ): void => {
    throw new Error(TextSerializationWriter.noStructuredDataMessage);
  };
  public writeCollectionOfObjectValues = <T extends Parsable>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    values?: T[],
    serializerMethod?: ModelSerializerFunction<T>
  ): void => {
    throw new Error(TextSerializationWriter.noStructuredDataMessage);
  };
  public writeObjectValue = <T extends Parsable>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value?: T,
    serializerMethod?: ModelSerializerFunction<T>
  ): void => {
    throw new Error(TextSerializationWriter.noStructuredDataMessage);
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
    const encoder = new TextEncoder();
    const encodedString = encoder.encode(str);
    return encodedString.buffer;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeAdditionalData = (
    value: Record<string, unknown> | undefined
  ): void => {
    throw new Error(TextSerializationWriter.noStructuredDataMessage);
  };
}
