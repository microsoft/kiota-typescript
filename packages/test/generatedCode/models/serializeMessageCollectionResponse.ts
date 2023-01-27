import {Message, MessageCollectionResponse} from './index';
import {serializeMessage} from './serializeMessage';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageCollectionResponse(writer: SerializationWriter, messageCollectionResponse: MessageCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(messageCollectionResponse)){
            switch(key){
                case "@odata.nextLink":
                    writer.writeStringValue("@odata.nextLink", messageCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<Message>("value", messageCollectionResponse.value, serializeMessage);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
