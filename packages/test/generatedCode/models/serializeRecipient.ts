import {EmailAddress} from './emailAddress';
import {Recipient} from './recipient';
import {serializeEmailAddress} from './serializeEmailAddress';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeRecipient(writer: SerializationWriter, recipient: Recipient | undefined = {}) : void {
        writer.writeObjectValue<EmailAddress>("emailAddress", recipient.emailAddress);
        writer.writeAdditionalData(recipient.additionalData);
}
