import {ExtensionsResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createExtensionsResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : ExtensionsResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new ExtensionsResponseImpl();
}
