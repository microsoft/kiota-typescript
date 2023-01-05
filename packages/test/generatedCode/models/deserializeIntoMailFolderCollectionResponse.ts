import {deserializeIntoMailFolder} from './deserializeIntoMailFolder';
import {MailFolder, MailFolderCollectionResponse} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMailFolderCollectionResponse(mailFolderCollectionResponse: MailFolderCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { mailFolderCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { mailFolderCollectionResponse.value = n.getCollectionOfObjectValues<MailFolder>(deserializeIntoMailFolder); },
    }
}
