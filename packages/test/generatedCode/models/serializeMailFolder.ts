import {MailFolder, Message, MessageRule, MultiValueLegacyExtendedProperty, SingleValueLegacyExtendedProperty} from './index';
import {serializeEntity} from './serializeEntity';
import {serializeMessage} from './serializeMessage';
import {serializeMessageRule} from './serializeMessageRule';
import {serializeMultiValueLegacyExtendedProperty} from './serializeMultiValueLegacyExtendedProperty';
import {serializeSingleValueLegacyExtendedProperty} from './serializeSingleValueLegacyExtendedProperty';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMailFolder(writer: SerializationWriter, mailFolder: MailFolder | undefined = {}) : void {
        serializeEntity(writer, mailFolder)
        for (const [key, value] of Object.entries(mailFolder)){
            switch(key){
                case "childFolderCount":
                    writer.writeNumberValue("childFolderCount", mailFolder.childFolderCount);
                break
                case "childFolders":
                    writer.writeCollectionOfObjectValues<MailFolder>("childFolders", mailFolder.childFolders, serializeMailFolder);
                break
                case "displayName":
                    writer.writeStringValue("displayName", mailFolder.displayName);
                break
                case "isHidden":
                    writer.writeBooleanValue("isHidden", mailFolder.isHidden);
                break
                case "messageRules":
                    writer.writeCollectionOfObjectValues<MessageRule>("messageRules", mailFolder.messageRules, serializeMessageRule);
                break
                case "messages":
                    writer.writeCollectionOfObjectValues<Message>("messages", mailFolder.messages, serializeMessage);
                break
                case "multiValueExtendedProperties":
                    writer.writeCollectionOfObjectValues<MultiValueLegacyExtendedProperty>("multiValueExtendedProperties", mailFolder.multiValueExtendedProperties, serializeMultiValueLegacyExtendedProperty);
                break
                case "parentFolderId":
                    writer.writeStringValue("parentFolderId", mailFolder.parentFolderId);
                break
                case "singleValueExtendedProperties":
                    writer.writeCollectionOfObjectValues<SingleValueLegacyExtendedProperty>("singleValueExtendedProperties", mailFolder.singleValueExtendedProperties, serializeSingleValueLegacyExtendedProperty);
                break
                case "totalItemCount":
                    writer.writeNumberValue("totalItemCount", mailFolder.totalItemCount);
                break
                case "unreadItemCount":
                    writer.writeNumberValue("unreadItemCount", mailFolder.unreadItemCount);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
