import {MultiValueExtendedPropertiesResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createMultiValueExtendedPropertiesResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : MultiValueExtendedPropertiesResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new MultiValueExtendedPropertiesResponseImpl();
}
