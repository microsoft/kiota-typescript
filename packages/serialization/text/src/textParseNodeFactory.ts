import { ParseNode, ParseNodeFactory } from "@microsoft/kiota-abstractions";

import { TextParseNode } from "./textParseNode";

export class TextParseNodeFactory implements ParseNodeFactory {
  public getValidContentType(): string {
    return "text/plain";
  }
  public getRootParseNode(
    contentType: string,
    content: ArrayBuffer
  ): ParseNode {
    if (!contentType) {
      throw new Error("content type cannot be undefined or empty");
    } else if (this.getValidContentType() !== contentType) {
      throw new Error(`expected a ${this.getValidContentType()} content type`);
    }
    if (!content) {
      throw new Error("content cannot be undefined of empty");
    }
    return new TextParseNode(this.convertArrayBufferToText(content));
  }

  private convertArrayBufferToText(arrayBuffer: ArrayBuffer) {
    const uint16Array = new Uint16Array(arrayBuffer);
    return String.fromCharCode.apply(null, [...uint16Array]);
  }
}
