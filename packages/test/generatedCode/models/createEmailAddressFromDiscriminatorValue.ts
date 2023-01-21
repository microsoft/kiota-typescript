import {deserializeIntoEmailAddress} from './deserializeIntoEmailAddress';
import {EmailAddress} from './emailAddress';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createEmailAddressFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoEmailAddress;
}
