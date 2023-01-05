import {deserializeIntoRecipient} from './deserializeIntoRecipient';
import {Importance} from './importance';
import {MessageRuleActions, Recipient} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMessageRuleActions(messageRuleActions: MessageRuleActions | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "assignCategories": n => { messageRuleActions.assignCategories = n.getCollectionOfPrimitiveValues<string>(); },
        "copyToFolder": n => { messageRuleActions.copyToFolder = n.getStringValue(); },
        "delete": n => { messageRuleActions.delete = n.getBooleanValue(); },
        "forwardAsAttachmentTo": n => { messageRuleActions.forwardAsAttachmentTo = n.getCollectionOfObjectValues<Recipient>(deserializeIntoRecipient); },
        "forwardTo": n => { messageRuleActions.forwardTo = n.getCollectionOfObjectValues<Recipient>(deserializeIntoRecipient); },
        "markAsRead": n => { messageRuleActions.markAsRead = n.getBooleanValue(); },
        "markImportance": n => { messageRuleActions.markImportance = n.getEnumValue<Importance>(Importance); },
        "moveToFolder": n => { messageRuleActions.moveToFolder = n.getStringValue(); },
        "permanentDelete": n => { messageRuleActions.permanentDelete = n.getBooleanValue(); },
        "redirectTo": n => { messageRuleActions.redirectTo = n.getCollectionOfObjectValues<Recipient>(deserializeIntoRecipient); },
        "stopProcessingRules": n => { messageRuleActions.stopProcessingRules = n.getBooleanValue(); },
    }
}
