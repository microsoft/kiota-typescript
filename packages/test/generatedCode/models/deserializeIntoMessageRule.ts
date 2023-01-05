import {deserializeIntoEntity} from './deserializeIntoEntity';
import {deserializeIntoMessageRuleActions} from './deserializeIntoMessageRuleActions';
import {deserializeIntoMessageRulePredicates} from './deserializeIntoMessageRulePredicates';
import {MessageRule, MessageRuleActions, MessageRulePredicates} from './index';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMessageRule(messageRule: MessageRule | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(messageRule),
        "actions": n => { messageRule.actions = n.getObjectValue<MessageRuleActions>(deserializeIntoMessageRuleActions); },
        "conditions": n => { messageRule.conditions = n.getObjectValue<MessageRulePredicates>(deserializeIntoMessageRulePredicates); },
        "displayName": n => { messageRule.displayName = n.getStringValue(); },
        "exceptions": n => { messageRule.exceptions = n.getObjectValue<MessageRulePredicates>(deserializeIntoMessageRulePredicates); },
        "hasError": n => { messageRule.hasError = n.getBooleanValue(); },
        "isEnabled": n => { messageRule.isEnabled = n.getBooleanValue(); },
        "isReadOnly": n => { messageRule.isReadOnly = n.getBooleanValue(); },
        "sequence": n => { messageRule.sequence = n.getNumberValue(); },
    }
}
