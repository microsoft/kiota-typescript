import {SingleValueLegacyExtendedProperty, SingleValueLegacyExtendedPropertyCollectionResponse} from './index';
import {serializeSingleValueLegacyExtendedProperty} from './serializeSingleValueLegacyExtendedProperty';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSingleValueLegacyExtendedPropertyCollectionResponse(writer: SerializationWriter, singleValueLegacyExtendedPropertyCollectionResponse: SingleValueLegacyExtendedPropertyCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(singleValueLegacyExtendedPropertyCollectionResponse)){
            switch(key){
                case "odataNextLink":
                    writer.writeStringValue("@odata.nextLink", singleValueLegacyExtendedPropertyCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<SingleValueLegacyExtendedProperty>("value", singleValueLegacyExtendedPropertyCollectionResponse.value, serializeSingleValueLegacyExtendedProperty);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
