import {Extension, ExtensionCollectionResponse} from './index';
import {serializeExtension} from './serializeExtension';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeExtensionCollectionResponse(writer: SerializationWriter, extensionCollectionResponse: ExtensionCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(extensionCollectionResponse)){
            switch(key){
                case "odataNextLink":
                    writer.writeStringValue("@odata.nextLink", extensionCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<Extension>("value", extensionCollectionResponse.value, serializeExtension);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
