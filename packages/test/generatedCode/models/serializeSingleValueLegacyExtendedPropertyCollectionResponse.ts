import {serializeSingleValueLegacyExtendedProperty} from './serializeSingleValueLegacyExtendedProperty';
import {SingleValueLegacyExtendedProperty} from './singleValueLegacyExtendedProperty';
import {SingleValueLegacyExtendedPropertyCollectionResponse} from './singleValueLegacyExtendedPropertyCollectionResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSingleValueLegacyExtendedPropertyCollectionResponse(writer: SerializationWriter, singleValueLegacyExtendedPropertyCollectionResponse: SingleValueLegacyExtendedPropertyCollectionResponse | undefined = {} as SingleValueLegacyExtendedPropertyCollectionResponse) : void {
        writer.writeStringValue("@odata.nextLink", singleValueLegacyExtendedPropertyCollectionResponse.odataNextLink);
        writer.writeCollectionOfObjectValues<SingleValueLegacyExtendedProperty>("value", singleValueLegacyExtendedPropertyCollectionResponse.value, serializeSingleValueLegacyExtendedProperty);
        writer.writeAdditionalData(singleValueLegacyExtendedPropertyCollectionResponse.additionalData);
}
