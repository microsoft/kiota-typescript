import {deserializeIntoItemBody} from './deserializeIntoItemBody';
import {ItemBody} from './itemBody';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createItemBodyFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoItemBody;
}
