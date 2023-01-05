import {deserializeIntoEntity} from './deserializeIntoEntity';
import {deserializeIntoMessage} from './deserializeIntoMessage';
import {deserializeIntoMessageRule} from './deserializeIntoMessageRule';
import {deserializeIntoMultiValueLegacyExtendedProperty} from './deserializeIntoMultiValueLegacyExtendedProperty';
import {deserializeIntoSingleValueLegacyExtendedProperty} from './deserializeIntoSingleValueLegacyExtendedProperty';
import {MailFolder, Message, MessageRule, MultiValueLegacyExtendedProperty, SingleValueLegacyExtendedProperty} from './index';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMailFolder(mailFolder: MailFolder | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(mailFolder),
        "childFolderCount": n => { mailFolder.childFolderCount = n.getNumberValue(); },
        "childFolders": n => { mailFolder.childFolders = n.getCollectionOfObjectValues<MailFolder>(deserializeIntoMailFolder); },
        "displayName": n => { mailFolder.displayName = n.getStringValue(); },
        "isHidden": n => { mailFolder.isHidden = n.getBooleanValue(); },
        "messageRules": n => { mailFolder.messageRules = n.getCollectionOfObjectValues<MessageRule>(deserializeIntoMessageRule); },
        "messages": n => { mailFolder.messages = n.getCollectionOfObjectValues<Message>(deserializeIntoMessage); },
        "multiValueExtendedProperties": n => { mailFolder.multiValueExtendedProperties = n.getCollectionOfObjectValues<MultiValueLegacyExtendedProperty>(deserializeIntoMultiValueLegacyExtendedProperty); },
        "parentFolderId": n => { mailFolder.parentFolderId = n.getStringValue(); },
        "singleValueExtendedProperties": n => { mailFolder.singleValueExtendedProperties = n.getCollectionOfObjectValues<SingleValueLegacyExtendedProperty>(deserializeIntoSingleValueLegacyExtendedProperty); },
        "totalItemCount": n => { mailFolder.totalItemCount = n.getNumberValue(); },
        "unreadItemCount": n => { mailFolder.unreadItemCount = n.getNumberValue(); },
    }
}
