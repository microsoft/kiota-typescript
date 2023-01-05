import {deserializeIntoAttachment} from './deserializeIntoAttachment';
import {deserializeIntoExtension} from './deserializeIntoExtension';
import {deserializeIntoFollowupFlag} from './deserializeIntoFollowupFlag';
import {deserializeIntoInternetMessageHeader} from './deserializeIntoInternetMessageHeader';
import {deserializeIntoItemBody} from './deserializeIntoItemBody';
import {deserializeIntoMultiValueLegacyExtendedProperty} from './deserializeIntoMultiValueLegacyExtendedProperty';
import {deserializeIntoOutlookItem} from './deserializeIntoOutlookItem';
import {deserializeIntoRecipient} from './deserializeIntoRecipient';
import {deserializeIntoSingleValueLegacyExtendedProperty} from './deserializeIntoSingleValueLegacyExtendedProperty';
import {Importance} from './importance';
import {Attachment, Extension, FollowupFlag, InternetMessageHeader, ItemBody, Message, MultiValueLegacyExtendedProperty, Recipient, SingleValueLegacyExtendedProperty} from './index';
import {InferenceClassificationType} from './inferenceClassificationType';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMessage(message: Message | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoOutlookItem(message),
        "attachments": n => { message.attachments = n.getCollectionOfObjectValues<Attachment>(deserializeIntoAttachment); },
        "bccRecipients": n => { message.bccRecipients = n.getCollectionOfObjectValues<Recipient>(deserializeIntoRecipient); },
        "body": n => { message.body = n.getObjectValue<ItemBody>(deserializeIntoItemBody); },
        "bodyPreview": n => { message.bodyPreview = n.getStringValue(); },
        "ccRecipients": n => { message.ccRecipients = n.getCollectionOfObjectValues<Recipient>(deserializeIntoRecipient); },
        "conversationId": n => { message.conversationId = n.getStringValue(); },
        "conversationIndex": n => { message.conversationIndex = n.getStringValue(); },
        "extensions": n => { message.extensions = n.getCollectionOfObjectValues<Extension>(deserializeIntoExtension); },
        "flag": n => { message.flag = n.getObjectValue<FollowupFlag>(deserializeIntoFollowupFlag); },
        "from": n => { message.from = n.getObjectValue<Recipient>(deserializeIntoRecipient); },
        "hasAttachments": n => { message.hasAttachments = n.getBooleanValue(); },
        "importance": n => { message.importance = n.getEnumValue<Importance>(Importance); },
        "inferenceClassification": n => { message.inferenceClassification = n.getEnumValue<InferenceClassificationType>(InferenceClassificationType); },
        "internetMessageHeaders": n => { message.internetMessageHeaders = n.getCollectionOfObjectValues<InternetMessageHeader>(deserializeIntoInternetMessageHeader); },
        "internetMessageId": n => { message.internetMessageId = n.getStringValue(); },
        "isDeliveryReceiptRequested": n => { message.isDeliveryReceiptRequested = n.getBooleanValue(); },
        "isDraft": n => { message.isDraft = n.getBooleanValue(); },
        "isRead": n => { message.isRead = n.getBooleanValue(); },
        "isReadReceiptRequested": n => { message.isReadReceiptRequested = n.getBooleanValue(); },
        "multiValueExtendedProperties": n => { message.multiValueExtendedProperties = n.getCollectionOfObjectValues<MultiValueLegacyExtendedProperty>(deserializeIntoMultiValueLegacyExtendedProperty); },
        "parentFolderId": n => { message.parentFolderId = n.getStringValue(); },
        "receivedDateTime": n => { message.receivedDateTime = n.getDateValue(); },
        "replyTo": n => { message.replyTo = n.getCollectionOfObjectValues<Recipient>(deserializeIntoRecipient); },
        "sender": n => { message.sender = n.getObjectValue<Recipient>(deserializeIntoRecipient); },
        "sentDateTime": n => { message.sentDateTime = n.getDateValue(); },
        "singleValueExtendedProperties": n => { message.singleValueExtendedProperties = n.getCollectionOfObjectValues<SingleValueLegacyExtendedProperty>(deserializeIntoSingleValueLegacyExtendedProperty); },
        "subject": n => { message.subject = n.getStringValue(); },
        "toRecipients": n => { message.toRecipients = n.getCollectionOfObjectValues<Recipient>(deserializeIntoRecipient); },
        "uniqueBody": n => { message.uniqueBody = n.getObjectValue<ItemBody>(deserializeIntoItemBody); },
        "webLink": n => { message.webLink = n.getStringValue(); },
    }
}
