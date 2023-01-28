import {MessageRule, MessageRuleCollectionResponse} from './index';
import {serializeMessageRule} from './serializeMessageRule';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageRuleCollectionResponse(writer: SerializationWriter, messageRuleCollectionResponse: MessageRuleCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(messageRuleCollectionResponse)){
            switch(key){
                case "odataNextLink":
                    writer.writeStringValue("@odata.nextLink", messageRuleCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<MessageRule>("value", messageRuleCollectionResponse.value, serializeMessageRule);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
