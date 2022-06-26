import {OverridesResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createOverridesResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : OverridesResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new OverridesResponseImpl();
}
