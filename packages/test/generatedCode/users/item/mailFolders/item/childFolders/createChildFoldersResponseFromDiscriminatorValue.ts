import {ChildFoldersResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createChildFoldersResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : ChildFoldersResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new ChildFoldersResponseImpl();
}
