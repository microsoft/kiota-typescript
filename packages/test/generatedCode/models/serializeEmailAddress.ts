import {EmailAddress} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeEmailAddress(writer: SerializationWriter, emailAddress: EmailAddress | undefined = {}) : void {
            writer.writeStringValue("address", emailAddress.address);
            writer.writeStringValue("name", emailAddress.name);
}
