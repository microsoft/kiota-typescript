import {MultiValueLegacyExtendedProperty, MultiValueLegacyExtendedPropertyCollectionResponse} from './index';
import {serializeMultiValueLegacyExtendedProperty} from './serializeMultiValueLegacyExtendedProperty';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMultiValueLegacyExtendedPropertyCollectionResponse(writer: SerializationWriter, multiValueLegacyExtendedPropertyCollectionResponse: MultiValueLegacyExtendedPropertyCollectionResponse | undefined = {}) : void {
            writer.writeStringValue("@odata.nextLink", multiValueLegacyExtendedPropertyCollectionResponse.odataNextLink);
            writer.writeCollectionOfObjectValues<MultiValueLegacyExtendedProperty>("value", multiValueLegacyExtendedPropertyCollectionResponse.value, serializeMultiValueLegacyExtendedProperty);
}
