import {BodyType} from './bodyType';
import {ItemBody} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeItemBody(writer: SerializationWriter, itemBody: ItemBody | undefined = {}) : void {
            writer.writeStringValue("content", itemBody.content);
            writer.writeEnumValue<BodyType>("contentType", itemBody.contentType);
}
