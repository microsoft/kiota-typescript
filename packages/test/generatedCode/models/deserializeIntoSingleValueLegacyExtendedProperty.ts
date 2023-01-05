import {deserializeIntoEntity} from './deserializeIntoEntity';
import {SingleValueLegacyExtendedProperty} from './index';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoSingleValueLegacyExtendedProperty(singleValueLegacyExtendedProperty: SingleValueLegacyExtendedProperty | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(singleValueLegacyExtendedProperty),
        "value": n => { singleValueLegacyExtendedProperty.value = n.getStringValue(); },
    }
}
