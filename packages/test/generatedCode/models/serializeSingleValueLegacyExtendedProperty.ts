import {SingleValueLegacyExtendedProperty} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSingleValueLegacyExtendedProperty(writer: SerializationWriter, singleValueLegacyExtendedProperty: SingleValueLegacyExtendedProperty | undefined = {}) : void {
        serializeEntity(writer, singleValueLegacyExtendedProperty)
            writer.writeStringValue("value", singleValueLegacyExtendedProperty.value);
}
