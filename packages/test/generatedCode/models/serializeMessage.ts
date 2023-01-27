import {Importance} from './importance';
import {Attachment, Extension, FollowupFlag, InternetMessageHeader, ItemBody, Message, MultiValueLegacyExtendedProperty, Recipient, SingleValueLegacyExtendedProperty} from './index';
import {InferenceClassificationType} from './inferenceClassificationType';
import {serializeAttachment} from './serializeAttachment';
import {serializeExtension} from './serializeExtension';
import {serializeFollowupFlag} from './serializeFollowupFlag';
import {serializeInternetMessageHeader} from './serializeInternetMessageHeader';
import {serializeItemBody} from './serializeItemBody';
import {serializeMultiValueLegacyExtendedProperty} from './serializeMultiValueLegacyExtendedProperty';
import {serializeOutlookItem} from './serializeOutlookItem';
import {serializeRecipient} from './serializeRecipient';
import {serializeSingleValueLegacyExtendedProperty} from './serializeSingleValueLegacyExtendedProperty';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessage(writer: SerializationWriter, message: Message | undefined = {}) : void {
        serializeOutlookItem(writer, message)
        for (const [key, value] of Object.entries(message)){
            switch(key){
                case "attachments":
                    writer.writeCollectionOfObjectValues<Attachment>("attachments", message.attachments, serializeAttachment);
                break
                case "bccRecipients":
                    writer.writeCollectionOfObjectValues<Recipient>("bccRecipients", message.bccRecipients, serializeRecipient);
                break
                case "body":
                    writer.writeObjectValue<ItemBody>("body", message.body, serializeItemBody);
                break
                case "bodyPreview":
                    writer.writeStringValue("bodyPreview", message.bodyPreview);
                break
                case "ccRecipients":
                    writer.writeCollectionOfObjectValues<Recipient>("ccRecipients", message.ccRecipients, serializeRecipient);
                break
                case "conversationId":
                    writer.writeStringValue("conversationId", message.conversationId);
                break
                case "conversationIndex":
                    writer.writeStringValue("conversationIndex", message.conversationIndex);
                break
                case "extensions":
                    writer.writeCollectionOfObjectValues<Extension>("extensions", message.extensions, serializeExtension);
                break
                case "flag":
                    writer.writeObjectValue<FollowupFlag>("flag", message.flag, serializeFollowupFlag);
                break
                case "from":
                    writer.writeObjectValue<Recipient>("from", message.from, serializeRecipient);
                break
                case "hasAttachments":
                    writer.writeBooleanValue("hasAttachments", message.hasAttachments);
                break
                case "importance":
                    writer.writeEnumValue<Importance>("importance", message.importance);
                break
                case "inferenceClassification":
                    writer.writeEnumValue<InferenceClassificationType>("inferenceClassification", message.inferenceClassification);
                break
                case "internetMessageHeaders":
                    writer.writeCollectionOfObjectValues<InternetMessageHeader>("internetMessageHeaders", message.internetMessageHeaders, serializeInternetMessageHeader);
                break
                case "internetMessageId":
                    writer.writeStringValue("internetMessageId", message.internetMessageId);
                break
                case "isDeliveryReceiptRequested":
                    writer.writeBooleanValue("isDeliveryReceiptRequested", message.isDeliveryReceiptRequested);
                break
                case "isDraft":
                    writer.writeBooleanValue("isDraft", message.isDraft);
                break
                case "isRead":
                    writer.writeBooleanValue("isRead", message.isRead);
                break
                case "isReadReceiptRequested":
                    writer.writeBooleanValue("isReadReceiptRequested", message.isReadReceiptRequested);
                break
                case "multiValueExtendedProperties":
                    writer.writeCollectionOfObjectValues<MultiValueLegacyExtendedProperty>("multiValueExtendedProperties", message.multiValueExtendedProperties, serializeMultiValueLegacyExtendedProperty);
                break
                case "parentFolderId":
                    writer.writeStringValue("parentFolderId", message.parentFolderId);
                break
                case "receivedDateTime":
                    writer.writeDateValue("receivedDateTime", message.receivedDateTime);
                break
                case "replyTo":
                    writer.writeCollectionOfObjectValues<Recipient>("replyTo", message.replyTo, serializeRecipient);
                break
                case "sender":
                    writer.writeObjectValue<Recipient>("sender", message.sender, serializeRecipient);
                break
                case "sentDateTime":
                    writer.writeDateValue("sentDateTime", message.sentDateTime);
                break
                case "singleValueExtendedProperties":
                    writer.writeCollectionOfObjectValues<SingleValueLegacyExtendedProperty>("singleValueExtendedProperties", message.singleValueExtendedProperties, serializeSingleValueLegacyExtendedProperty);
                break
                case "subject":
                    writer.writeStringValue("subject", message.subject);
                break
                case "toRecipients":
                    writer.writeCollectionOfObjectValues<Recipient>("toRecipients", message.toRecipients, serializeRecipient);
                break
                case "uniqueBody":
                    writer.writeObjectValue<ItemBody>("uniqueBody", message.uniqueBody, serializeItemBody);
                break
                case "webLink":
                    writer.writeStringValue("webLink", message.webLink);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
