import {EmailAddress} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeEmailAddress(writer: SerializationWriter, emailAddress: EmailAddress | undefined = {}) : void {
        for (const [key, value] of Object.entries(emailAddress)){
            switch(key){
                case "address":
                    writer.writeStringValue("address", emailAddress.address);
                break
                case "name":
                    writer.writeStringValue("name", emailAddress.name);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
