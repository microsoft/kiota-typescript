import {SingleValueLegacyExtendedProperty, SingleValueLegacyExtendedPropertyCollectionResponse} from './index';
import {serializeSingleValueLegacyExtendedProperty} from './serializeSingleValueLegacyExtendedProperty';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSingleValueLegacyExtendedPropertyCollectionResponse(writer: SerializationWriter, singleValueLegacyExtendedPropertyCollectionResponse: SingleValueLegacyExtendedPropertyCollectionResponse | undefined = {}) : void {
            writer.writeStringValue("@odata.nextLink", singleValueLegacyExtendedPropertyCollectionResponse.odataNextLink);
            writer.writeCollectionOfObjectValues<SingleValueLegacyExtendedProperty>("value", singleValueLegacyExtendedPropertyCollectionResponse.value, serializeSingleValueLegacyExtendedProperty);
}
