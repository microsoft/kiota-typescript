import {
  DateOnly,
  Duration,
  Parsable,
  ParsableFactory,
  parseGuidString,
  ParseNode,
  TimeOnly,
  toFirstCharacterUpper,
} from "@microsoft/kiota-abstractions";

export class FormParseNode implements ParseNode {
  private readonly _fields: Record<string, string> = {};
  /**
   *
   */
  constructor(private readonly _rawString: string) {
    if (!_rawString) {
      throw new Error("rawString cannot be undefined");
    }
    _rawString
      .split("&")
      .map((x) => x.split("="))
      .filter((x) => x.length === 2)
      .forEach((x) => {
        const key = this.normalizeKey(x[0]);
        if (this._fields[key]) {
          this._fields[key] += "," + x[1];
        } else {
          this._fields[key] = x[1];
        }
      });
  }
  private normalizeKey = (key: string): string =>
    decodeURIComponent(key).trim();
  public getByteArrayValue(): Uint8Array | undefined {
    throw new Error(
      "serialization of byt arrays is not supported with URI encoding",
    );
  }
  public onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
  public onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
  public getStringValue = (): string => decodeURIComponent(this._rawString);
  public getChildNode = (identifier: string): ParseNode | undefined => {
    if (this._fields[identifier]) {
      return new FormParseNode(this._fields[identifier]);
    }
    return undefined;
  };
  public getBooleanValue = () => {
    const value = this.getStringValue()?.toLowerCase();
    if (value === "true" || value === "1") {
      return true;
    } else if (value === "false" || value === "0") {
      return false;
    }
    return undefined;
  };
  public getNumberValue = () => parseFloat(this.getStringValue());
  public getGuidValue = () => parseGuidString(this.getStringValue());
  public getDateValue = () => new Date(Date.parse(this.getStringValue()));
  public getDateOnlyValue = () => DateOnly.parse(this.getStringValue());
  public getTimeOnlyValue = () => TimeOnly.parse(this.getStringValue());
  public getDurationValue = () => Duration.parse(this.getStringValue());
  public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
    throw new Error(
      `serialization of collections is not supported with URI encoding`,
    );
  };
  public getCollectionOfObjectValues = <T extends Parsable>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parsableFactory: ParsableFactory<T>,
  ): T[] | undefined => {
    throw new Error(
      `serialization of collections is not supported with URI encoding`,
    );
  };
  public getObjectValue = <T extends Parsable>(
    parsableFactory: ParsableFactory<T>,
  ): T => {
    const value: T = {} as T;
    if (this.onBeforeAssignFieldValues) {
      this.onBeforeAssignFieldValues(value);
    }
    this.assignFieldValues(value, parsableFactory);
    if (this.onAfterAssignFieldValues) {
      this.onAfterAssignFieldValues(value);
    }
    return value;
  };
  public getCollectionOfEnumValues = <T>(type: any): T[] => {
    const rawValues = this.getStringValue();
    if (!rawValues) {
      return [];
    }
    return rawValues.split(",").map((x) => type[toFirstCharacterUpper(x)] as T);
  };
  public getEnumValue = <T>(type: any): T | undefined => {
    const values = this.getCollectionOfEnumValues(type);
    if (values.length > 0) {
      return values[0] as T;
    } else {
      return undefined;
    }
  };
  private assignFieldValues = <T extends Parsable>(
    model: T,
    parsableFactory: ParsableFactory<T>,
  ): void => {
    const fields = parsableFactory(this)(model);
    Object.entries(this._fields)
      .filter((x) => !/^null$/i.test(x[1]))
      .forEach(([k, v]) => {
        const deserializer = fields[k];
        if (deserializer) {
          deserializer(new FormParseNode(v));
        } else {
          (model as Record<string, unknown>)[k] = v;
        }
      });
  };
}
