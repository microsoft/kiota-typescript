import {MultiValueLegacyExtendedProperty, MultiValueLegacyExtendedPropertyCollectionResponse} from './index';
import {serializeMultiValueLegacyExtendedProperty} from './serializeMultiValueLegacyExtendedProperty';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMultiValueLegacyExtendedPropertyCollectionResponse(writer: SerializationWriter, multiValueLegacyExtendedPropertyCollectionResponse: MultiValueLegacyExtendedPropertyCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(multiValueLegacyExtendedPropertyCollectionResponse)){
            switch(key){
                case "odataNextLink":
                    writer.writeStringValue("@odata.nextLink", multiValueLegacyExtendedPropertyCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<MultiValueLegacyExtendedProperty>("value", multiValueLegacyExtendedPropertyCollectionResponse.value, serializeMultiValueLegacyExtendedProperty);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
