import {MultiValueLegacyExtendedProperty} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMultiValueLegacyExtendedProperty(writer: SerializationWriter, multiValueLegacyExtendedProperty: MultiValueLegacyExtendedProperty | undefined = {}) : void {
        serializeEntity(writer, multiValueLegacyExtendedProperty)
        for (const [key, value] of Object.entries(multiValueLegacyExtendedProperty)){
            switch(key){
                case "value":
                    writer.writeCollectionOfPrimitiveValues<string>("value", multiValueLegacyExtendedProperty.value);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
