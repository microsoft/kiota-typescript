import { ParseNode, ParseNodeFactory } from "@microsoft/kiota-abstractions";
import { TextDecoder } from "util";

import { TextParseNode } from "./textParseNode";

export class TextParseNodeFactory implements ParseNodeFactory {
  public getValidContentType(): string {
    return "text/plain";
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
    return new TextParseNode(this.convertArrayBufferToText(content));
  }

  private convertArrayBufferToText(arrayBuffer: ArrayBuffer) {
    const decoder = new TextDecoder();
    return decoder.decode(arrayBuffer);
  }
}
