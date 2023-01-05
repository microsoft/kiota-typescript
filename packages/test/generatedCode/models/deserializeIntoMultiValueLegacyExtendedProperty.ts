import {deserializeIntoEntity} from './deserializeIntoEntity';
import {MultiValueLegacyExtendedProperty} from './index';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoMultiValueLegacyExtendedProperty(multiValueLegacyExtendedProperty: MultiValueLegacyExtendedProperty | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(multiValueLegacyExtendedProperty),
        "value": n => { multiValueLegacyExtendedProperty.value = n.getCollectionOfPrimitiveValues<string>(); },
    }
}
