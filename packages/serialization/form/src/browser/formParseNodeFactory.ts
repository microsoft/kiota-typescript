import type { ParseNode, ParseNodeFactory } from "@microsoft/kiota-abstractions";

import { FormParseNode } from "./../formParseNode";

export class FormParseNodeFactory implements ParseNodeFactory {
  public getValidContentType(): string {
    return "application/x-www-form-urlencoded";
  }
  public getRootParseNode(
    contentType: string,
    content: ArrayBuffer
  ): ParseNode {
    if (!content) {
      throw new Error("content cannot be undefined of empty");
    } else if (!contentType) {
      throw new Error("content type cannot be undefined or empty");
    } else if (this.getValidContentType() !== contentType) {
      throw new Error(`expected a ${this.getValidContentType()} content type`);
    }
    return new FormParseNode(this.convertArrayBufferToString(content));
  }

  private convertArrayBufferToString(content: ArrayBuffer) {
    const decoder = new TextDecoder();
    return decoder.decode(content);
  }
}
