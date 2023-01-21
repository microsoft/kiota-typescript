import {SingleValueLegacyExtendedProperty} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSingleValueLegacyExtendedProperty(writer: SerializationWriter, singleValueLegacyExtendedProperty: SingleValueLegacyExtendedProperty | undefined = {}) : void {
        serializeEntity(writer, singleValueLegacyExtendedProperty)
            writer.writeStringValue("value", singleValueLegacyExtendedProperty.value);
}
