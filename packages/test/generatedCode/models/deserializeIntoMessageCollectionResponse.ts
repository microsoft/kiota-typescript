import {deserializeIntoMessage} from './deserializeIntoMessage';
import {Message, MessageCollectionResponse} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMessageCollectionResponse(messageCollectionResponse: MessageCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { messageCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { messageCollectionResponse.value = n.getCollectionOfObjectValues<Message>(deserializeIntoMessage); },
    }
}
