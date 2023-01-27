import {BodyType} from './bodyType';
import {ItemBody} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeItemBody(writer: SerializationWriter, itemBody: ItemBody | undefined = {}) : void {
        for (const [key, value] of Object.entries(itemBody)){
            switch(key){
                case "content":
                    writer.writeStringValue("content", itemBody.content);
                break
                case "contentType":
                    writer.writeEnumValue<BodyType>("contentType", itemBody.contentType);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
