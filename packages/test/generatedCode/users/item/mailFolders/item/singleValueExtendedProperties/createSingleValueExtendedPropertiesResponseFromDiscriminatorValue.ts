import {SingleValueExtendedPropertiesResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createSingleValueExtendedPropertiesResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : SingleValueExtendedPropertiesResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new SingleValueExtendedPropertiesResponseImpl();
}
