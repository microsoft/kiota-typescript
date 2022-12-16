import {
  AdditionalDataHolder,
  DateOnly,
  Duration,
  Parsable,
  ParsableFactory,
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
  private normalizeKey = (key: string): string => key.trim();
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
  public getGuidValue = () => this.getStringValue();
  public getDateValue = () => new Date(Date.parse(this.getStringValue()));
  public getDateOnlyValue = () => DateOnly.parse(this.getStringValue());
  public getTimeOnlyValue = () => TimeOnly.parse(this.getStringValue());
  public getDurationValue = () => Duration.parse(this.getStringValue());
  public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
    throw new Error(
      `serialization of collections is not supported with URI encoding`
    );
  };
  public getCollectionOfObjectValues = <T extends Parsable>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _type: ParsableFactory<T>
  ): T[] | undefined => {
    throw new Error(
      `serialization of collections is not supported with URI encoding`
    );
  };
  public getObjectValue = <T extends Parsable>(type: ParsableFactory<T>): T => {
    const result = type(this);
    if (this.onBeforeAssignFieldValues) {
      this.onBeforeAssignFieldValues(result);
    }
    this.assignFieldValues(result);
    if (this.onAfterAssignFieldValues) {
      this.onAfterAssignFieldValues(result);
    }
    return result;
  };
  public getEnumValues = <T>(type: any): T[] => {
    const rawValues = this.getStringValue();
    if (!rawValues) {
      return [];
    }
    return rawValues.split(",").map((x) => type[toFirstCharacterUpper(x)] as T);
  };
  public getEnumValue = <T>(type: any): T | undefined => {
    const values = this.getEnumValues(type);
    if (values.length > 0) {
      return values[0] as T;
    } else {
      return undefined;
    }
  };
  private assignFieldValues = <T extends Parsable>(item: T): void => {
    const fields = item.getFieldDeserializers();
    let itemAdditionalData: Record<string, unknown> | undefined;
    const holder = item as unknown as AdditionalDataHolder;
    if (holder && holder.additionalData) {
      itemAdditionalData = holder.additionalData;
    }
    Object.entries(this._fields)
      .filter((x) => !/^null$/i.test(x[1]))
      .forEach(([k, v]) => {
        const deserializer = fields[k];
        if (deserializer) {
          deserializer(new FormParseNode(v));
        } else if (itemAdditionalData) {
          itemAdditionalData[k] = v;
        }
      });
  };
}
