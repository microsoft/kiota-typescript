import {
  createBackedModelProxyHandler,
  DateOnly,
  Duration,
  Parsable,
  ParsableFactory,
  parseGuidString,
  ParseNode,
  TimeOnly,
  isBackingStoreEnabled,
  toFirstCharacterUpper,
} from "@microsoft/kiota-abstractions";

export class JsonParseNode implements ParseNode {
  /**
   *
   */
  constructor(private readonly _jsonNode: unknown) {}
  public onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
  public onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
  public getStringValue = () => this._jsonNode as string;
  public getChildNode = (identifier: string): ParseNode | undefined =>
    new JsonParseNode((this._jsonNode as any)[identifier]);
  public getBooleanValue = () => this._jsonNode as boolean;
  public getNumberValue = () => this._jsonNode as number;
  public getGuidValue = () => parseGuidString(this.getStringValue());
  public getDateValue = () => this._jsonNode ? new Date(this._jsonNode as string) : undefined;
  public getDateOnlyValue = () => DateOnly.parse(this.getStringValue());
  public getTimeOnlyValue = () => TimeOnly.parse(this.getStringValue());
  public getDurationValue = () => Duration.parse(this.getStringValue());
  public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
    return (this._jsonNode as unknown[]).map((x) => {
      const currentParseNode = new JsonParseNode(x);
      const typeOfX = typeof x;
      if (typeOfX === "boolean") {
        return currentParseNode.getBooleanValue() as unknown as T;
      } else if (typeOfX === "string") {
        return currentParseNode.getStringValue() as unknown as T;
      } else if (typeOfX === "number") {
        return currentParseNode.getNumberValue() as unknown as T;
      } else if (x instanceof Date) {
        return currentParseNode.getDateValue() as unknown as T;
      } else if (x instanceof DateOnly) {
        return currentParseNode.getDateValue() as unknown as T;
      } else if (x instanceof TimeOnly) {
        return currentParseNode.getDateValue() as unknown as T;
      } else if (x instanceof Duration) {
        return currentParseNode.getDateValue() as unknown as T;
      } else {
        throw new Error(
          `encountered an unknown type during deserialization ${typeof x}`,
        );
      }
    });
  };
  public getByteArrayValue(): ArrayBuffer | undefined {
    const strValue = this.getStringValue();
    if (strValue && strValue.length > 0) {
      return Buffer.from(strValue, "base64").buffer;
    }
    return undefined;
  }
  public getCollectionOfObjectValues = <T extends Parsable>(
    method: ParsableFactory<T>,
  ): T[] | undefined => {
    return this._jsonNode ? (this._jsonNode as unknown[])
      .map((x) => new JsonParseNode(x))
      .map((x) => x.getObjectValue<T>(method)) : undefined;
  };

  public getObjectValue = <T extends Parsable>(
    parsableFactory: ParsableFactory<T>,
  ): T => {
    const temp: T = {} as T;
    if (this.onBeforeAssignFieldValues) {
      this.onBeforeAssignFieldValues(temp);
    }
    this.assignFieldValues(temp, parsableFactory);
    const value: T = isBackingStoreEnabled(temp) ? new Proxy({}, createBackedModelProxyHandler<T>()) as T : temp;
    if (this.onAfterAssignFieldValues) {
      this.onAfterAssignFieldValues(value);
    }
    return value;
  };

  private assignFieldValues = <T extends Parsable>(
    model: T,
    parsableFactory: ParsableFactory<T>,
  ): void => {
    const fields = parsableFactory(this)(model);

    if (!this._jsonNode) return;
    Object.entries(this._jsonNode as any).forEach(([k, v]) => {
      const deserializer = fields[k];

      if (deserializer) {
        deserializer(new JsonParseNode(v));
      } else {
        // additional properties
        (model as Record<string, unknown>)[k] = v;
      }
    });
  };
  public getCollectionOfEnumValues = <T>(type: any): T[] => {
    if (Array.isArray(this._jsonNode)) {
      return this._jsonNode
        .map((x) => {
          const node = new JsonParseNode(x);
          return node.getEnumValue(type) as T;
        })
        .filter(Boolean);
    }
    return [];
  };
  public getEnumValue = <T>(type: any): T | undefined => {
    const rawValue = this.getStringValue();
    if (!rawValue) {
      return undefined;
    }
    return type[toFirstCharacterUpper(rawValue)];
  };
}
