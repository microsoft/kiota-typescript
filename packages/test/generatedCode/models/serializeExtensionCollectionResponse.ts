import {Extension, ExtensionCollectionResponse} from './index';
import {serializeExtension} from './serializeExtension';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeExtensionCollectionResponse(writer: SerializationWriter, extensionCollectionResponse: ExtensionCollectionResponse | undefined = {}) : void {
            writer.writeStringValue("@odata.nextLink", extensionCollectionResponse.odataNextLink);
            writer.writeCollectionOfObjectValues<Extension>("value", extensionCollectionResponse.value, serializeExtension);
}
