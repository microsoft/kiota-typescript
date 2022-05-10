import {AttachmentsResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createAttachmentsResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : AttachmentsResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new AttachmentsResponseImpl();
}
