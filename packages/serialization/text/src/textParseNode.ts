import {
  DateOnly,
  Duration,
  Parsable,
  ParsableFactory,
  ParseNode,
  TimeOnly,
  toFirstCharacterUpper,
} from "@microsoft/kiota-abstractions";

export class TextParseNode implements ParseNode {
  private static noStructuredDataMessage =
    "text does not support structured data";
  /**
   *
   */
  constructor(private readonly text: string) {
    if (
      this.text &&
      this.text.length > 1 &&
      this.text.charAt(0) === '"' &&
      this.text.charAt(this.text.length - 1) === '"'
    ) {
      this.text = this.text.substring(1, this.text.length - 2);
    }
  }
  public onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
  public onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
  public getStringValue = () => this.text;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getChildNode = (identifier: string): ParseNode | undefined => {
    throw new Error(TextParseNode.noStructuredDataMessage);
  };
  public getBooleanValue = (): boolean | undefined => {
    const value = this.getStringValue()?.toLowerCase();
    if (value === "true" || value === "1") {
      return true;
    } else if (value === "false" || value === "0") {
      return false;
    }
    return undefined;
  };
  public getNumberValue = () => Number(this.text);
  public getGuidValue = () => this.text;
  public getDateValue = () => new Date(Date.parse(this.text));
  public getDateOnlyValue = () => DateOnly.parse(this.getStringValue());
  public getTimeOnlyValue = () => TimeOnly.parse(this.getStringValue());
  public getDurationValue = () => Duration.parse(this.getStringValue());
  public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
    throw new Error(TextParseNode.noStructuredDataMessage);
  };
  public getCollectionOfObjectValues = <T extends Parsable>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type: ParsableFactory<T>
  ): T[] | undefined => {
    throw new Error(TextParseNode.noStructuredDataMessage);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getObjectValue = <T extends Parsable>(type: ParsableFactory<T>): T => {
    throw new Error(TextParseNode.noStructuredDataMessage);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getEnumValues = <T>(type: any): T[] => {
    throw new Error(TextParseNode.noStructuredDataMessage);
  };
  public getEnumValue = <T>(type: any): T | undefined => {
    return type[toFirstCharacterUpper(this.text)] as T;
  };
}
