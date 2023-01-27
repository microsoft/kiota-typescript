import {Attachment, AttachmentCollectionResponse} from './index';
import {serializeAttachment} from './serializeAttachment';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeAttachmentCollectionResponse(writer: SerializationWriter, attachmentCollectionResponse: AttachmentCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(attachmentCollectionResponse)){
            switch(key){
                case "@odata.nextLink":
                    writer.writeStringValue("@odata.nextLink", attachmentCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<Attachment>("value", attachmentCollectionResponse.value, serializeAttachment);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
