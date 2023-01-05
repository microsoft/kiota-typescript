import {deserializeIntoSingleValueLegacyExtendedProperty} from './deserializeIntoSingleValueLegacyExtendedProperty';
import {SingleValueLegacyExtendedProperty, SingleValueLegacyExtendedPropertyCollectionResponse} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoSingleValueLegacyExtendedPropertyCollectionResponse(singleValueLegacyExtendedPropertyCollectionResponse: SingleValueLegacyExtendedPropertyCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { singleValueLegacyExtendedPropertyCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { singleValueLegacyExtendedPropertyCollectionResponse.value = n.getCollectionOfObjectValues<SingleValueLegacyExtendedProperty>(deserializeIntoSingleValueLegacyExtendedProperty); },
    }
}
