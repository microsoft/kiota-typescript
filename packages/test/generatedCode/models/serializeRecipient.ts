import {EmailAddress, Recipient} from './index';
import {serializeEmailAddress} from './serializeEmailAddress';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeRecipient(writer: SerializationWriter, recipient: Recipient | undefined = {}) : void {
        for (const [key, value] of Object.entries(recipient)){
            switch(key){
                case "emailAddress":
                    writer.writeObjectValue<EmailAddress>("emailAddress", recipient.emailAddress, serializeEmailAddress);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
