import { Parsable, ParseNode, SerializationWriter } from "@microsoft/kiota-abstractions";

export class MockEntity implements Parsable {
	getFieldDeserializers(): Record<string, (node: ParseNode) => void> {
		return {};
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	serialize(writer: SerializationWriter): void {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CreateMockEntityFromParseNode(node: ParseNode): MockEntity {
	return new MockEntity();
}
