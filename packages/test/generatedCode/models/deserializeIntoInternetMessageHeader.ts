import {InternetMessageHeader} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoInternetMessageHeader(internetMessageHeader: InternetMessageHeader | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "name": n => { internetMessageHeader.name = n.getStringValue(); },
        "value": n => { internetMessageHeader.value = n.getStringValue(); },
    }
}
