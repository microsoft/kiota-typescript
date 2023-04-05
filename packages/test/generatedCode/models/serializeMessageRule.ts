import {MessageRule} from './messageRule';
import {MessageRuleActions} from './messageRuleActions';
import {MessageRulePredicates} from './messageRulePredicates';
import {serializeEntity} from './serializeEntity';
import {serializeMessageRuleActions} from './serializeMessageRuleActions';
import {serializeMessageRulePredicates} from './serializeMessageRulePredicates';
import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageRule(writer: SerializationWriter, messageRule: MessageRule | undefined = {}) : void {
        serializeEntity(writer, messageRule)
        writer.writeObjectValue<MessageRuleActions>("actions", messageRule.actions);
        writer.writeObjectValue<MessageRulePredicates>("conditions", messageRule.conditions);
        writer.writeStringValue("displayName", messageRule.displayName);
        writer.writeObjectValue<MessageRulePredicates>("exceptions", messageRule.exceptions);
        writer.writeBooleanValue("hasError", messageRule.hasError);
        writer.writeBooleanValue("isEnabled", messageRule.isEnabled);
        writer.writeBooleanValue("isReadOnly", messageRule.isReadOnly);
        writer.writeNumberValue("sequence", messageRule.sequence);
}
