import {EmailAddress} from './emailAddress';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoEmailAddress(emailAddress: EmailAddress | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "address": n => { emailAddress.address = n.getStringValue(); },
        "name": n => { emailAddress.name = n.getStringValue(); },
    }
}
