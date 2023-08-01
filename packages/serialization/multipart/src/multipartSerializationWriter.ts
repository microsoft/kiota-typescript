/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  DateOnly,
  Duration,
  ModelSerializerFunction,
  MultipartBody,
  Parsable,
  SerializationWriter,
  TimeOnly,
} from "@microsoft/kiota-abstractions";
import { Guid } from "guid-typescript";

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
    this.writer.push(...new Uint8Array(value));
  }
  private readonly writer: number[] = [];
  public onBeforeObjectSerialization: ((value: Parsable) => void) | undefined;
  public onAfterObjectSerialization: ((value: Parsable) => void) | undefined;
  public onStartObjectSerialization:
    | ((value: Parsable, writer: SerializationWriter) => void)
    | undefined;
  public writeStringValue = (key?: string, value?: string): void => {
    if (key) {
      this.writeRawStringValue(key);
    }
    if (value) {
      if (key) {
        this.writeRawStringValue(": ");
      }
      this.writeRawStringValue(value);
    }
    this.writeRawStringValue("\r\n");
  };
  private writeRawStringValue = (value?: string): void => {
    if (value) {
      this.writeByteArrayValue(undefined, new TextEncoder().encode(value));
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeBooleanValue = (key?: string, value?: boolean): void => {
    throw new Error(
      `serialization of boolean values is not supported with multipart`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeNumberValue = (key?: string, value?: number): void => {
    throw new Error(
      `serialization of number values is not supported with multipart`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeGuidValue = (key?: string, value?: Guid): void => {
    throw new Error(
      `serialization of guid values is not supported with multipart`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeDateValue = (key?: string, value?: Date): void => {
    throw new Error(
      `serialization of date values is not supported with multipart`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeDateOnlyValue = (key?: string, value?: DateOnly): void => {
    throw new Error(
      `serialization of date only values is not supported with multipart`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeTimeOnlyValue = (key?: string, value?: TimeOnly): void => {
    throw new Error(
      `serialization of time only values is not supported with multipart`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeDurationValue = (key?: string, value?: Duration): void => {
    throw new Error(
      `serialization of duration values is not supported with multipart`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeNullValue = (key?: string): void => {
    throw new Error(
      `serialization of null values is not supported with multipart`,
    );
  };
  public writeCollectionOfPrimitiveValues = <T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _key?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _values?: T[],
  ): void => {
    throw new Error(
      `serialization of collections is not supported with multipart`,
    );
  };
  public writeCollectionOfObjectValues = <T extends Parsable>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _key?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _values?: T[],
  ): void => {
    throw new Error(
      `serialization of collections is not supported with multipart`,
    );
  };
  public writeObjectValue = <T extends Parsable>(
    key: string | undefined,
    value: T | undefined,
    serializerMethod: ModelSerializerFunction<T>,
  ): void => {
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
    this.onStartObjectSerialization &&
      this.onStartObjectSerialization(value, this);
    serializerMethod(this, value);
    this.onAfterObjectSerialization && this.onAfterObjectSerialization(value);
  };
  public writeEnumValue = <T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key?: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...values: (T | undefined)[]
  ): void => {
    throw new Error(
      `serialization of enum values is not supported with multipart`,
    );
  };
  public getSerializedContent = (): ArrayBuffer => {
    return new Uint8Array(this.writer).buffer;
  };

  public writeAdditionalData = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    additionalData: Record<string, unknown> | undefined,
  ): void => {
    throw new Error(
      `serialization of additional data is not supported with multipart`,
    );
  };
}
