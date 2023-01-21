import {AttachmentCollectionResponse} from './attachmentCollectionResponse';
import {deserializeIntoAttachmentCollectionResponse} from './deserializeIntoAttachmentCollectionResponse';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createAttachmentCollectionResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoAttachmentCollectionResponse;
}
