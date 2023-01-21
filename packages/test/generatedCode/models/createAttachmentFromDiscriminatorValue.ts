import {Attachment} from './attachment';
import {deserializeIntoAttachment} from './deserializeIntoAttachment';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createAttachmentFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoAttachment;
}
