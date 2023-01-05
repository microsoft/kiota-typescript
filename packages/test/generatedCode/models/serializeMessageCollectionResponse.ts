import {Message, MessageCollectionResponse} from './index';
import {serializeMessage} from './serializeMessage';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageCollectionResponse(writer: SerializationWriter, messageCollectionResponse: MessageCollectionResponse | undefined = {}) : void {
            writer.writeStringValue("@odata.nextLink", messageCollectionResponse.odataNextLink);
            writer.writeCollectionOfObjectValues<Message>("value", messageCollectionResponse.value, serializeMessage);
}
