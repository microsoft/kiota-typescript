import {deserializeIntoEmailAddress} from './deserializeIntoEmailAddress';
import {EmailAddress, Recipient} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoRecipient(recipient: Recipient | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "emailAddress": n => { recipient.emailAddress = n.getObjectValue<EmailAddress>(deserializeIntoEmailAddress); },
    }
}
