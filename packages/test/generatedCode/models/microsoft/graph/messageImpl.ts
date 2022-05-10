import {Attachment} from './attachment';
import {createAttachmentFromDiscriminatorValue} from './createAttachmentFromDiscriminatorValue';
import {createExtensionFromDiscriminatorValue} from './createExtensionFromDiscriminatorValue';
import {createFollowupFlagFromDiscriminatorValue} from './createFollowupFlagFromDiscriminatorValue';
import {createInternetMessageHeaderFromDiscriminatorValue} from './createInternetMessageHeaderFromDiscriminatorValue';
import {createItemBodyFromDiscriminatorValue} from './createItemBodyFromDiscriminatorValue';
import {createMultiValueLegacyExtendedPropertyFromDiscriminatorValue} from './createMultiValueLegacyExtendedPropertyFromDiscriminatorValue';
import {createRecipientFromDiscriminatorValue} from './createRecipientFromDiscriminatorValue';
import {createSingleValueLegacyExtendedPropertyFromDiscriminatorValue} from './createSingleValueLegacyExtendedPropertyFromDiscriminatorValue';
import {Extension} from './extension';
import {FollowupFlag} from './followupFlag';
import {Importance} from './importance';
import {AttachmentImpl, ExtensionImpl, FollowupFlagImpl, InternetMessageHeaderImpl, ItemBodyImpl, MultiValueLegacyExtendedPropertyImpl, OutlookItemImpl, RecipientImpl, SingleValueLegacyExtendedPropertyImpl} from './index';
import {InferenceClassificationType} from './inferenceClassificationType';
import {InternetMessageHeader} from './internetMessageHeader';
import {ItemBody} from './itemBody';
import {Message} from './message';
import {MultiValueLegacyExtendedProperty} from './multiValueLegacyExtendedProperty';
import {Recipient} from './recipient';
import {SingleValueLegacyExtendedProperty} from './singleValueLegacyExtendedProperty';
import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class MessageImpl extends OutlookItemImpl implements Message, Parsable {
    /** The fileAttachment and itemAttachment attachments for the message.  */
    attachments?: Attachment[] | undefined;
    /** The Bcc: recipients for the message.  */
    bccRecipients?: Recipient[] | undefined;
    /** The body property  */
    body?: ItemBody | undefined;
    /** The first 255 characters of the message body. It is in text format.  */
    bodyPreview?: string | undefined;
    /** The Cc: recipients for the message.  */
    ccRecipients?: Recipient[] | undefined;
    /** The ID of the conversation the email belongs to.  */
    conversationId?: string | undefined;
    /** Indicates the position of the message within the conversation.  */
    conversationIndex?: string | undefined;
    /** The collection of open extensions defined for the message. Nullable.  */
    extensions?: Extension[] | undefined;
    /** The flag property  */
    flag?: FollowupFlag | undefined;
    /** The from property  */
    from?: Recipient | undefined;
    /** Indicates whether the message has attachments. This property doesn't include inline attachments, so if a message contains only inline attachments, this property is false. To verify the existence of inline attachments, parse the body property to look for a src attribute, such as <IMG src='cid:image001.jpg@01D26CD8.6C05F070'>.  */
    hasAttachments?: boolean | undefined;
    /** The importance property  */
    importance?: Importance | undefined;
    /** The inferenceClassification property  */
    inferenceClassification?: InferenceClassificationType | undefined;
    /** The internetMessageHeaders property  */
    internetMessageHeaders?: InternetMessageHeader[] | undefined;
    /** The internetMessageId property  */
    internetMessageId?: string | undefined;
    /** The isDeliveryReceiptRequested property  */
    isDeliveryReceiptRequested?: boolean | undefined;
    /** The isDraft property  */
    isDraft?: boolean | undefined;
    /** The isRead property  */
    isRead?: boolean | undefined;
    /** The isReadReceiptRequested property  */
    isReadReceiptRequested?: boolean | undefined;
    /** The collection of multi-value extended properties defined for the message. Nullable.  */
    multiValueExtendedProperties?: MultiValueLegacyExtendedProperty[] | undefined;
    /** The parentFolderId property  */
    parentFolderId?: string | undefined;
    /** The receivedDateTime property  */
    receivedDateTime?: Date | undefined;
    /** The replyTo property  */
    replyTo?: Recipient[] | undefined;
    /** The sender property  */
    sender?: Recipient | undefined;
    /** The sentDateTime property  */
    sentDateTime?: Date | undefined;
    /** The collection of single-value extended properties defined for the message. Nullable.  */
    singleValueExtendedProperties?: SingleValueLegacyExtendedProperty[] | undefined;
    /** The subject property  */
    subject?: string | undefined;
    /** The toRecipients property  */
    toRecipients?: Recipient[] | undefined;
    /** The uniqueBody property  */
    uniqueBody?: ItemBody | undefined;
    /** The webLink property  */
    webLink?: string | undefined;
    /**
     * Instantiates a new message and sets the default values.
     * @param messageParameterValue 
     */
    public constructor(messageParameterValue?: Message | undefined) {
        super();
        this.attachments = messageParameterValue?.attachments ;
        this.bccRecipients = messageParameterValue?.bccRecipients ;
        this.body = messageParameterValue?.body ;
        this.bodyPreview = messageParameterValue?.bodyPreview ;
        this.ccRecipients = messageParameterValue?.ccRecipients ;
        this.conversationId = messageParameterValue?.conversationId ;
        this.conversationIndex = messageParameterValue?.conversationIndex ;
        this.extensions = messageParameterValue?.extensions ;
        this.flag = messageParameterValue?.flag ;
        this.from = messageParameterValue?.from ;
        this.hasAttachments = messageParameterValue?.hasAttachments ;
        this.importance = messageParameterValue?.importance ;
        this.inferenceClassification = messageParameterValue?.inferenceClassification ;
        this.internetMessageHeaders = messageParameterValue?.internetMessageHeaders ;
        this.internetMessageId = messageParameterValue?.internetMessageId ;
        this.isDeliveryReceiptRequested = messageParameterValue?.isDeliveryReceiptRequested ;
        this.isDraft = messageParameterValue?.isDraft ;
        this.isRead = messageParameterValue?.isRead ;
        this.isReadReceiptRequested = messageParameterValue?.isReadReceiptRequested ;
        this.multiValueExtendedProperties = messageParameterValue?.multiValueExtendedProperties ;
        this.parentFolderId = messageParameterValue?.parentFolderId ;
        this.receivedDateTime = messageParameterValue?.receivedDateTime ;
        this.replyTo = messageParameterValue?.replyTo ;
        this.sender = messageParameterValue?.sender ;
        this.sentDateTime = messageParameterValue?.sentDateTime ;
        this.singleValueExtendedProperties = messageParameterValue?.singleValueExtendedProperties ;
        this.subject = messageParameterValue?.subject ;
        this.toRecipients = messageParameterValue?.toRecipients ;
        this.uniqueBody = messageParameterValue?.uniqueBody ;
        this.webLink = messageParameterValue?.webLink ;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {...super.getFieldDeserializers(),
            "attachments": n => { this.attachments = n.getCollectionOfObjectValues<AttachmentImpl>(createAttachmentFromDiscriminatorValue); },
            "bccRecipients": n => { this.bccRecipients = n.getCollectionOfObjectValues<RecipientImpl>(createRecipientFromDiscriminatorValue); },
            "body": n => { this.body = n.getObjectValue<ItemBodyImpl>(createItemBodyFromDiscriminatorValue); },
            "bodyPreview": n => { this.bodyPreview = n.getStringValue(); },
            "ccRecipients": n => { this.ccRecipients = n.getCollectionOfObjectValues<RecipientImpl>(createRecipientFromDiscriminatorValue); },
            "conversationId": n => { this.conversationId = n.getStringValue(); },
            "conversationIndex": n => { this.conversationIndex = n.getStringValue(); },
            "extensions": n => { this.extensions = n.getCollectionOfObjectValues<ExtensionImpl>(createExtensionFromDiscriminatorValue); },
            "flag": n => { this.flag = n.getObjectValue<FollowupFlagImpl>(createFollowupFlagFromDiscriminatorValue); },
            "from": n => { this.from = n.getObjectValue<RecipientImpl>(createRecipientFromDiscriminatorValue); },
            "hasAttachments": n => { this.hasAttachments = n.getBooleanValue(); },
            "importance": n => { this.importance = n.getEnumValue<Importance>(Importance); },
            "inferenceClassification": n => { this.inferenceClassification = n.getEnumValue<InferenceClassificationType>(InferenceClassificationType); },
            "internetMessageHeaders": n => { this.internetMessageHeaders = n.getCollectionOfObjectValues<InternetMessageHeaderImpl>(createInternetMessageHeaderFromDiscriminatorValue); },
            "internetMessageId": n => { this.internetMessageId = n.getStringValue(); },
            "isDeliveryReceiptRequested": n => { this.isDeliveryReceiptRequested = n.getBooleanValue(); },
            "isDraft": n => { this.isDraft = n.getBooleanValue(); },
            "isRead": n => { this.isRead = n.getBooleanValue(); },
            "isReadReceiptRequested": n => { this.isReadReceiptRequested = n.getBooleanValue(); },
            "multiValueExtendedProperties": n => { this.multiValueExtendedProperties = n.getCollectionOfObjectValues<MultiValueLegacyExtendedPropertyImpl>(createMultiValueLegacyExtendedPropertyFromDiscriminatorValue); },
            "parentFolderId": n => { this.parentFolderId = n.getStringValue(); },
            "receivedDateTime": n => { this.receivedDateTime = n.getDateValue(); },
            "replyTo": n => { this.replyTo = n.getCollectionOfObjectValues<RecipientImpl>(createRecipientFromDiscriminatorValue); },
            "sender": n => { this.sender = n.getObjectValue<RecipientImpl>(createRecipientFromDiscriminatorValue); },
            "sentDateTime": n => { this.sentDateTime = n.getDateValue(); },
            "singleValueExtendedProperties": n => { this.singleValueExtendedProperties = n.getCollectionOfObjectValues<SingleValueLegacyExtendedPropertyImpl>(createSingleValueLegacyExtendedPropertyFromDiscriminatorValue); },
            "subject": n => { this.subject = n.getStringValue(); },
            "toRecipients": n => { this.toRecipients = n.getCollectionOfObjectValues<RecipientImpl>(createRecipientFromDiscriminatorValue); },
            "uniqueBody": n => { this.uniqueBody = n.getObjectValue<ItemBodyImpl>(createItemBodyFromDiscriminatorValue); },
            "webLink": n => { this.webLink = n.getStringValue(); },
        };
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        super.serialize(writer);
        if(this.attachments){
        const attachmentsArrValue: AttachmentImpl[] = []; this.attachments?.forEach(element => {attachmentsArrValue.push(new AttachmentImpl(element));});
        writer.writeCollectionOfObjectValues<AttachmentImpl>("attachments", attachmentsArrValue);
        }
        if(this.bccRecipients){
        const bccRecipientsArrValue: RecipientImpl[] = []; this.bccRecipients?.forEach(element => {bccRecipientsArrValue.push(new RecipientImpl(element));});
        writer.writeCollectionOfObjectValues<RecipientImpl>("bccRecipients", bccRecipientsArrValue);
        }
        if(this.body){
        if(this.body)
        writer.writeObjectValue<ItemBodyImpl>("body", new ItemBodyImpl(this.body));
        }
        if(this.bodyPreview){
        if(this.bodyPreview)
        writer.writeStringValue("bodyPreview", this.bodyPreview);
        }
        if(this.ccRecipients){
        const ccRecipientsArrValue: RecipientImpl[] = []; this.ccRecipients?.forEach(element => {ccRecipientsArrValue.push(new RecipientImpl(element));});
        writer.writeCollectionOfObjectValues<RecipientImpl>("ccRecipients", ccRecipientsArrValue);
        }
        if(this.conversationId){
        if(this.conversationId)
        writer.writeStringValue("conversationId", this.conversationId);
        }
        if(this.conversationIndex){
        if(this.conversationIndex)
        writer.writeStringValue("conversationIndex", this.conversationIndex);
        }
        if(this.extensions){
        const extensionsArrValue: ExtensionImpl[] = []; this.extensions?.forEach(element => {extensionsArrValue.push(new ExtensionImpl(element));});
        writer.writeCollectionOfObjectValues<ExtensionImpl>("extensions", extensionsArrValue);
        }
        if(this.flag){
        if(this.flag)
        writer.writeObjectValue<FollowupFlagImpl>("flag", new FollowupFlagImpl(this.flag));
        }
        if(this.from){
        if(this.from)
        writer.writeObjectValue<RecipientImpl>("from", new RecipientImpl(this.from));
        }
        if(this.hasAttachments){
        if(this.hasAttachments)
        writer.writeBooleanValue("hasAttachments", this.hasAttachments);
        }
        if(this.importance){
        if(this.importance)
        writer.writeEnumValue<Importance>("importance", this.importance);
        }
        if(this.inferenceClassification){
        if(this.inferenceClassification)
        writer.writeEnumValue<InferenceClassificationType>("inferenceClassification", this.inferenceClassification);
        }
        if(this.internetMessageHeaders){
        const internetMessageHeadersArrValue: InternetMessageHeaderImpl[] = []; this.internetMessageHeaders?.forEach(element => {internetMessageHeadersArrValue.push(new InternetMessageHeaderImpl(element));});
        writer.writeCollectionOfObjectValues<InternetMessageHeaderImpl>("internetMessageHeaders", internetMessageHeadersArrValue);
        }
        if(this.internetMessageId){
        if(this.internetMessageId)
        writer.writeStringValue("internetMessageId", this.internetMessageId);
        }
        if(this.isDeliveryReceiptRequested){
        if(this.isDeliveryReceiptRequested)
        writer.writeBooleanValue("isDeliveryReceiptRequested", this.isDeliveryReceiptRequested);
        }
        if(this.isDraft){
        if(this.isDraft)
        writer.writeBooleanValue("isDraft", this.isDraft);
        }
        if(this.isRead){
        if(this.isRead)
        writer.writeBooleanValue("isRead", this.isRead);
        }
        if(this.isReadReceiptRequested){
        if(this.isReadReceiptRequested)
        writer.writeBooleanValue("isReadReceiptRequested", this.isReadReceiptRequested);
        }
        if(this.multiValueExtendedProperties){
        const multiValueExtendedPropertiesArrValue: MultiValueLegacyExtendedPropertyImpl[] = []; this.multiValueExtendedProperties?.forEach(element => {multiValueExtendedPropertiesArrValue.push(new MultiValueLegacyExtendedPropertyImpl(element));});
        writer.writeCollectionOfObjectValues<MultiValueLegacyExtendedPropertyImpl>("multiValueExtendedProperties", multiValueExtendedPropertiesArrValue);
        }
        if(this.parentFolderId){
        if(this.parentFolderId)
        writer.writeStringValue("parentFolderId", this.parentFolderId);
        }
        if(this.receivedDateTime){
        if(this.receivedDateTime)
        writer.writeDateValue("receivedDateTime", this.receivedDateTime);
        }
        if(this.replyTo){
        const replyToArrValue: RecipientImpl[] = []; this.replyTo?.forEach(element => {replyToArrValue.push(new RecipientImpl(element));});
        writer.writeCollectionOfObjectValues<RecipientImpl>("replyTo", replyToArrValue);
        }
        if(this.sender){
        if(this.sender)
        writer.writeObjectValue<RecipientImpl>("sender", new RecipientImpl(this.sender));
        }
        if(this.sentDateTime){
        if(this.sentDateTime)
        writer.writeDateValue("sentDateTime", this.sentDateTime);
        }
        if(this.singleValueExtendedProperties){
        const singleValueExtendedPropertiesArrValue: SingleValueLegacyExtendedPropertyImpl[] = []; this.singleValueExtendedProperties?.forEach(element => {singleValueExtendedPropertiesArrValue.push(new SingleValueLegacyExtendedPropertyImpl(element));});
        writer.writeCollectionOfObjectValues<SingleValueLegacyExtendedPropertyImpl>("singleValueExtendedProperties", singleValueExtendedPropertiesArrValue);
        }
        if(this.subject){
        if(this.subject)
        writer.writeStringValue("subject", this.subject);
        }
        if(this.toRecipients){
        const toRecipientsArrValue: RecipientImpl[] = []; this.toRecipients?.forEach(element => {toRecipientsArrValue.push(new RecipientImpl(element));});
        writer.writeCollectionOfObjectValues<RecipientImpl>("toRecipients", toRecipientsArrValue);
        }
        if(this.uniqueBody){
        if(this.uniqueBody)
        writer.writeObjectValue<ItemBodyImpl>("uniqueBody", new ItemBodyImpl(this.uniqueBody));
        }
        if(this.webLink){
        if(this.webLink)
        writer.writeStringValue("webLink", this.webLink);
        }
    };
}
