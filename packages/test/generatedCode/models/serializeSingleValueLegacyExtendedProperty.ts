import {SingleValueLegacyExtendedProperty} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSingleValueLegacyExtendedProperty(writer: SerializationWriter, singleValueLegacyExtendedProperty: SingleValueLegacyExtendedProperty | undefined = {}) : void {
        serializeEntity(writer, singleValueLegacyExtendedProperty)
        for (const [key, value] of Object.entries(singleValueLegacyExtendedProperty)){
            switch(key){
                case "value":
                    writer.writeStringValue("value", singleValueLegacyExtendedProperty.value);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
