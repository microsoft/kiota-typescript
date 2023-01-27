import {Importance} from './importance';
import {MessageRuleActions, Recipient} from './index';
import {serializeRecipient} from './serializeRecipient';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageRuleActions(writer: SerializationWriter, messageRuleActions: MessageRuleActions | undefined = {}) : void {
        for (const [key, value] of Object.entries(messageRuleActions)){
            switch(key){
                case "assignCategories":
                    writer.writeCollectionOfPrimitiveValues<string>("assignCategories", messageRuleActions.assignCategories);
                break
                case "copyToFolder":
                    writer.writeStringValue("copyToFolder", messageRuleActions.copyToFolder);
                break
                case "delete":
                    writer.writeBooleanValue("delete", messageRuleActions.delete);
                break
                case "forwardAsAttachmentTo":
                    writer.writeCollectionOfObjectValues<Recipient>("forwardAsAttachmentTo", messageRuleActions.forwardAsAttachmentTo, serializeRecipient);
                break
                case "forwardTo":
                    writer.writeCollectionOfObjectValues<Recipient>("forwardTo", messageRuleActions.forwardTo, serializeRecipient);
                break
                case "markAsRead":
                    writer.writeBooleanValue("markAsRead", messageRuleActions.markAsRead);
                break
                case "markImportance":
                    writer.writeEnumValue<Importance>("markImportance", messageRuleActions.markImportance);
                break
                case "moveToFolder":
                    writer.writeStringValue("moveToFolder", messageRuleActions.moveToFolder);
                break
                case "permanentDelete":
                    writer.writeBooleanValue("permanentDelete", messageRuleActions.permanentDelete);
                break
                case "redirectTo":
                    writer.writeCollectionOfObjectValues<Recipient>("redirectTo", messageRuleActions.redirectTo, serializeRecipient);
                break
                case "stopProcessingRules":
                    writer.writeBooleanValue("stopProcessingRules", messageRuleActions.stopProcessingRules);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
