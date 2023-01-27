import {MessageRule, MessageRuleActions, MessageRulePredicates} from './index';
import {serializeEntity} from './serializeEntity';
import {serializeMessageRuleActions} from './serializeMessageRuleActions';
import {serializeMessageRulePredicates} from './serializeMessageRulePredicates';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageRule(writer: SerializationWriter, messageRule: MessageRule | undefined = {}) : void {
        serializeEntity(writer, messageRule)
        for (const [key, value] of Object.entries(messageRule)){
            switch(key){
                case "actions":
                    writer.writeObjectValue<MessageRuleActions>("actions", messageRule.actions, serializeMessageRuleActions);
                break
                case "conditions":
                    writer.writeObjectValue<MessageRulePredicates>("conditions", messageRule.conditions, serializeMessageRulePredicates);
                break
                case "displayName":
                    writer.writeStringValue("displayName", messageRule.displayName);
                break
                case "exceptions":
                    writer.writeObjectValue<MessageRulePredicates>("exceptions", messageRule.exceptions, serializeMessageRulePredicates);
                break
                case "hasError":
                    writer.writeBooleanValue("hasError", messageRule.hasError);
                break
                case "isEnabled":
                    writer.writeBooleanValue("isEnabled", messageRule.isEnabled);
                break
                case "isReadOnly":
                    writer.writeBooleanValue("isReadOnly", messageRule.isReadOnly);
                break
                case "sequence":
                    writer.writeNumberValue("sequence", messageRule.sequence);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
