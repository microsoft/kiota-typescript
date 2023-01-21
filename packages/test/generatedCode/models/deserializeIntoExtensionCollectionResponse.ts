import {createExtensionFromDiscriminatorValue} from './createExtensionFromDiscriminatorValue';
import {Extension, ExtensionCollectionResponse} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoExtensionCollectionResponse(extensionCollectionResponse: ExtensionCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { extensionCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { extensionCollectionResponse.value = n.getCollectionOfObjectValues<Extension>(createExtensionFromDiscriminatorValue); },
    }
}
