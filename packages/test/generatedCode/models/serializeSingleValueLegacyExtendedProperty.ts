import {serializeEntity} from './serializeEntity';
import {SingleValueLegacyExtendedProperty} from './singleValueLegacyExtendedProperty';
import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSingleValueLegacyExtendedProperty(writer: SerializationWriter, singleValueLegacyExtendedProperty: SingleValueLegacyExtendedProperty | undefined = {}) : void {
        serializeEntity(writer, singleValueLegacyExtendedProperty)
        writer.writeStringValue("value", singleValueLegacyExtendedProperty.value);
}
