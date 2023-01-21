import {EmailAddress, Recipient} from './index';
import {serializeEmailAddress} from './serializeEmailAddress';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeRecipient(writer: SerializationWriter, recipient: Recipient | undefined = {}) : void {
            writer.writeObjectValue<EmailAddress>("emailAddress", recipient.emailAddress, serializeEmailAddress);
}
