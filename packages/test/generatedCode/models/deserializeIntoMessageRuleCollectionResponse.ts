import {createMessageRuleFromDiscriminatorValue} from './createMessageRuleFromDiscriminatorValue';
import {MessageRule, MessageRuleCollectionResponse} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMessageRuleCollectionResponse(messageRuleCollectionResponse: MessageRuleCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { messageRuleCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { messageRuleCollectionResponse.value = n.getCollectionOfObjectValues<MessageRule>(createMessageRuleFromDiscriminatorValue); },
    }
}
