import {deserializeIntoMultiValueLegacyExtendedProperty} from './deserializeIntoMultiValueLegacyExtendedProperty';
import {MultiValueLegacyExtendedProperty, MultiValueLegacyExtendedPropertyCollectionResponse} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMultiValueLegacyExtendedPropertyCollectionResponse(multiValueLegacyExtendedPropertyCollectionResponse: MultiValueLegacyExtendedPropertyCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { multiValueLegacyExtendedPropertyCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { multiValueLegacyExtendedPropertyCollectionResponse.value = n.getCollectionOfObjectValues<MultiValueLegacyExtendedProperty>(deserializeIntoMultiValueLegacyExtendedProperty); },
    }
}
