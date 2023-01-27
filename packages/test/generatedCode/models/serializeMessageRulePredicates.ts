import {Importance} from './importance';
import {MessageRulePredicates, Recipient, SizeRange} from './index';
import {MessageActionFlag} from './messageActionFlag';
import {Sensitivity} from './sensitivity';
import {serializeRecipient} from './serializeRecipient';
import {serializeSizeRange} from './serializeSizeRange';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMessageRulePredicates(writer: SerializationWriter, messageRulePredicates: MessageRulePredicates | undefined = {}) : void {
        for (const [key, value] of Object.entries(messageRulePredicates)){
            switch(key){
                case "bodyContains":
                    writer.writeCollectionOfPrimitiveValues<string>("bodyContains", messageRulePredicates.bodyContains);
                break
                case "bodyOrSubjectContains":
                    writer.writeCollectionOfPrimitiveValues<string>("bodyOrSubjectContains", messageRulePredicates.bodyOrSubjectContains);
                break
                case "categories":
                    writer.writeCollectionOfPrimitiveValues<string>("categories", messageRulePredicates.categories);
                break
                case "fromAddresses":
                    writer.writeCollectionOfObjectValues<Recipient>("fromAddresses", messageRulePredicates.fromAddresses, serializeRecipient);
                break
                case "hasAttachments":
                    writer.writeBooleanValue("hasAttachments", messageRulePredicates.hasAttachments);
                break
                case "headerContains":
                    writer.writeCollectionOfPrimitiveValues<string>("headerContains", messageRulePredicates.headerContains);
                break
                case "importance":
                    writer.writeEnumValue<Importance>("importance", messageRulePredicates.importance);
                break
                case "isApprovalRequest":
                    writer.writeBooleanValue("isApprovalRequest", messageRulePredicates.isApprovalRequest);
                break
                case "isAutomaticForward":
                    writer.writeBooleanValue("isAutomaticForward", messageRulePredicates.isAutomaticForward);
                break
                case "isAutomaticReply":
                    writer.writeBooleanValue("isAutomaticReply", messageRulePredicates.isAutomaticReply);
                break
                case "isEncrypted":
                    writer.writeBooleanValue("isEncrypted", messageRulePredicates.isEncrypted);
                break
                case "isMeetingRequest":
                    writer.writeBooleanValue("isMeetingRequest", messageRulePredicates.isMeetingRequest);
                break
                case "isMeetingResponse":
                    writer.writeBooleanValue("isMeetingResponse", messageRulePredicates.isMeetingResponse);
                break
                case "isNonDeliveryReport":
                    writer.writeBooleanValue("isNonDeliveryReport", messageRulePredicates.isNonDeliveryReport);
                break
                case "isPermissionControlled":
                    writer.writeBooleanValue("isPermissionControlled", messageRulePredicates.isPermissionControlled);
                break
                case "isReadReceipt":
                    writer.writeBooleanValue("isReadReceipt", messageRulePredicates.isReadReceipt);
                break
                case "isSigned":
                    writer.writeBooleanValue("isSigned", messageRulePredicates.isSigned);
                break
                case "isVoicemail":
                    writer.writeBooleanValue("isVoicemail", messageRulePredicates.isVoicemail);
                break
                case "messageActionFlag":
                    writer.writeEnumValue<MessageActionFlag>("messageActionFlag", messageRulePredicates.messageActionFlag);
                break
                case "notSentToMe":
                    writer.writeBooleanValue("notSentToMe", messageRulePredicates.notSentToMe);
                break
                case "recipientContains":
                    writer.writeCollectionOfPrimitiveValues<string>("recipientContains", messageRulePredicates.recipientContains);
                break
                case "senderContains":
                    writer.writeCollectionOfPrimitiveValues<string>("senderContains", messageRulePredicates.senderContains);
                break
                case "sensitivity":
                    writer.writeEnumValue<Sensitivity>("sensitivity", messageRulePredicates.sensitivity);
                break
                case "sentCcMe":
                    writer.writeBooleanValue("sentCcMe", messageRulePredicates.sentCcMe);
                break
                case "sentOnlyToMe":
                    writer.writeBooleanValue("sentOnlyToMe", messageRulePredicates.sentOnlyToMe);
                break
                case "sentToAddresses":
                    writer.writeCollectionOfObjectValues<Recipient>("sentToAddresses", messageRulePredicates.sentToAddresses, serializeRecipient);
                break
                case "sentToMe":
                    writer.writeBooleanValue("sentToMe", messageRulePredicates.sentToMe);
                break
                case "sentToOrCcMe":
                    writer.writeBooleanValue("sentToOrCcMe", messageRulePredicates.sentToOrCcMe);
                break
                case "subjectContains":
                    writer.writeCollectionOfPrimitiveValues<string>("subjectContains", messageRulePredicates.subjectContains);
                break
                case "withinSizeRange":
                    writer.writeObjectValue<SizeRange>("withinSizeRange", messageRulePredicates.withinSizeRange, serializeSizeRange);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
