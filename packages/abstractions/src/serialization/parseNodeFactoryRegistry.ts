import { ParseNode } from "./parseNode";
import { ParseNodeFactory } from "./parseNodeFactory";

/**
 * This factory holds a list of all the registered factories for the various types of nodes.
 */
export class ParseNodeFactoryRegistry implements ParseNodeFactory {
  /** Default singleton instance of the registry to be used when registring new factories that should be available by default. */
  public static readonly defaultInstance = new ParseNodeFactoryRegistry();
  public getValidContentType(): string {
    throw new Error(
      "The registry supports multiple content types. Get the registered factory instead."
    );
  }
  /** List of factories that are registered by content type. */
  public contentTypeAssociatedFactories = new Map<string, ParseNodeFactory>();
  public getRootParseNode(
    contentType: string,
    content: ArrayBuffer
  ): ParseNode {
    if (!contentType) {
      throw new Error("content type cannot be undefined or empty");
    }
    if (!content) {
      throw new Error("content cannot be undefined or empty");
    }
    const vendorSpecificContentType = contentType.split(";")[0];
    let factory = this.contentTypeAssociatedFactories.get(
      vendorSpecificContentType
    );
    if (factory) {
      return factory.getRootParseNode(vendorSpecificContentType, content);
    }
    const cleanedContentType = vendorSpecificContentType.replace(
      /[^/]+\+/gi,
      ""
    );
    factory = this.contentTypeAssociatedFactories.get(cleanedContentType);
    if (factory) {
      return factory.getRootParseNode(cleanedContentType, content);
    }
    throw new Error(
      `Content type ${cleanedContentType} does not have a factory registered to be parsed`
    );
  }
}
