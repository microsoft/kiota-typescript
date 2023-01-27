import {MailFolder, MailFolderCollectionResponse} from './index';
import {serializeMailFolder} from './serializeMailFolder';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMailFolderCollectionResponse(writer: SerializationWriter, mailFolderCollectionResponse: MailFolderCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(mailFolderCollectionResponse)){
            switch(key){
                case "@odata.nextLink":
                    writer.writeStringValue("@odata.nextLink", mailFolderCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<MailFolder>("value", mailFolderCollectionResponse.value, serializeMailFolder);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
