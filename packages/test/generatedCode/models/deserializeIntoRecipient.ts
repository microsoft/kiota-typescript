import {createEmailAddressFromDiscriminatorValue} from './createEmailAddressFromDiscriminatorValue';
import {EmailAddress, Recipient} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoRecipient(recipient: Recipient | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "emailAddress": n => { recipient.emailAddress = n.getObjectValue<EmailAddress>(createEmailAddressFromDiscriminatorValue); },
    }
}
