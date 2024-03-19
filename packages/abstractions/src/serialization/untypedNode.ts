/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import type { SerializationWriter } from "./serializationWriter";

export interface UntypedNode extends Parsable {
  getValue(): any
  value?: any;
}

export function createUntypedNodeFromDiscriminatorValue(
  _parseNode: ParseNode | undefined,
): (instance?: Parsable) => Record<string, (node: ParseNode) => void> {
  return deserializeIntoUntypedNode;
}

export function isUntypedNode(node: any): node is UntypedNode {
  const potentialNode = node as UntypedNode;
  return potentialNode && potentialNode.getValue !== undefined;
}

export function deserializeIntoUntypedNode(
  untypedNode: Partial<UntypedNode> | undefined = {},
): Record<string, (node: ParseNode) => void> {
  return {
    value: (n) => {
      untypedNode.value = null;
    },
    getValue: (n) => {
      untypedNode.getValue = () => untypedNode.value;
    },
  };
}

export function serializeUntypedNode(
  _writer: SerializationWriter,
  _errorDetails: Partial<UntypedNode> | undefined = {},
): void {
  return;
}
