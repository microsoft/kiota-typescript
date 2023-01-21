import {Attachment, AttachmentCollectionResponse} from './index';
import {serializeAttachment} from './serializeAttachment';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeAttachmentCollectionResponse(writer: SerializationWriter, attachmentCollectionResponse: AttachmentCollectionResponse | undefined = {}) : void {
            writer.writeStringValue("@odata.nextLink", attachmentCollectionResponse.odataNextLink);
            writer.writeCollectionOfObjectValues<Attachment>("value", attachmentCollectionResponse.value, serializeAttachment);
}
