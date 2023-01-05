import {MessageRule, MessageRuleCollectionResponse} from './index';
import {serializeMessageRule} from './serializeMessageRule';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageRuleCollectionResponse(writer: SerializationWriter, messageRuleCollectionResponse: MessageRuleCollectionResponse | undefined = {}) : void {
            writer.writeStringValue("@odata.nextLink", messageRuleCollectionResponse.odataNextLink);
            writer.writeCollectionOfObjectValues<MessageRule>("value", messageRuleCollectionResponse.value, serializeMessageRule);
}
