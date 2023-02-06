import {createSingleValueLegacyExtendedPropertyFromDiscriminatorValue} from './createSingleValueLegacyExtendedPropertyFromDiscriminatorValue';
import {serializeSingleValueLegacyExtendedProperty} from './serializeSingleValueLegacyExtendedProperty';
import {SingleValueLegacyExtendedProperty} from './singleValueLegacyExtendedProperty';
import {SingleValueLegacyExtendedPropertyCollectionResponse} from './singleValueLegacyExtendedPropertyCollectionResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoSingleValueLegacyExtendedPropertyCollectionResponse(singleValueLegacyExtendedPropertyCollectionResponse: SingleValueLegacyExtendedPropertyCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { singleValueLegacyExtendedPropertyCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { singleValueLegacyExtendedPropertyCollectionResponse.value = n.getCollectionOfObjectValues<SingleValueLegacyExtendedProperty>(createSingleValueLegacyExtendedPropertyFromDiscriminatorValue); },
    }
}
