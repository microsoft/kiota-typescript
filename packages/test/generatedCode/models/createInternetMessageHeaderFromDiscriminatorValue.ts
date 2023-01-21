import {deserializeIntoInternetMessageHeader} from './deserializeIntoInternetMessageHeader';
import {InternetMessageHeader} from './internetMessageHeader';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createInternetMessageHeaderFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoInternetMessageHeader;
}
