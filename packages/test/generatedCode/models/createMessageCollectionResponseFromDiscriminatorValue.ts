import {deserializeIntoMessageCollectionResponse} from './deserializeIntoMessageCollectionResponse';
import {MessageCollectionResponse} from './messageCollectionResponse';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createMessageCollectionResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoMessageCollectionResponse;
}
