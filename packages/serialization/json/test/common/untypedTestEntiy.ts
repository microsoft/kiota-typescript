import {
  createUntypedNodeFromDiscriminatorValue,
  SerializationWriter,
  type ParseNode,
  type UntypedNode,
} from "@microsoft/kiota-abstractions";

export interface UntypedTestEntity {
  id?: string | undefined;
  title?: string | undefined;
  location?: UntypedNode | undefined;
  keywords?: UntypedNode | undefined;
  detail?: UntypedNode | undefined;
  table?: UntypedNode | undefined;
  additionalData?: Record<string, unknown>;
}

export function createUntypedTestEntityFromDiscriminatorValue(
  parseNode: ParseNode | undefined,
) {
  if (!parseNode) throw new Error("parseNode cannot be undefined");
  return deserializeUntypedTestEntity;
}

export function deserializeUntypedTestEntity(
  untypedTestEntity: UntypedTestEntity | undefined = {},
): Record<string, (node: ParseNode) => void> {
  return {
    id: (n) => {
      untypedTestEntity.id = n.getStringValue();
    },
    title: (n) => {
      untypedTestEntity.title = n.getStringValue();
    },
    location: (n) => {
      untypedTestEntity.location = n.getObjectValue<UntypedNode>(
        createUntypedNodeFromDiscriminatorValue,
      );
    },
    keywords: (n) => {
      untypedTestEntity.keywords = n.getObjectValue<UntypedNode>(
        createUntypedNodeFromDiscriminatorValue,
      );
    },
    detail: (n) => {
      untypedTestEntity.detail = n.getObjectValue<UntypedNode>(
        createUntypedNodeFromDiscriminatorValue,
      );
    },
    table: (n) => {
      untypedTestEntity.table = n.getObjectValue<UntypedNode>(
        createUntypedNodeFromDiscriminatorValue,
      );
    },
  };
}

export function serializeUntypedTestEntity(
  writer: SerializationWriter,
  untypedTestEntity: UntypedTestEntity | undefined = {},
): void {
  writer.writeStringValue("id", untypedTestEntity.id);
  writer.writeStringValue("title", untypedTestEntity.title);
  writer.writeObjectValue("location", untypedTestEntity.location);
  writer.writeObjectValue("keywords", untypedTestEntity.keywords);
  writer.writeObjectValue("detail", untypedTestEntity.detail);
  writer.writeObjectValue("table", untypedTestEntity.table);
  writer.writeAdditionalData(untypedTestEntity.additionalData);
}
