import {MailFolder, MailFolderCollectionResponse} from './index';
import {serializeMailFolder} from './serializeMailFolder';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMailFolderCollectionResponse(writer: SerializationWriter, mailFolderCollectionResponse: MailFolderCollectionResponse | undefined = {}) : void {
            writer.writeStringValue("@odata.nextLink", mailFolderCollectionResponse.odataNextLink);
            writer.writeCollectionOfObjectValues<MailFolder>("value", mailFolderCollectionResponse.value, serializeMailFolder);
}
