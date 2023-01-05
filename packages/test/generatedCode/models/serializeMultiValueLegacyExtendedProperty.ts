import {MultiValueLegacyExtendedProperty} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeMultiValueLegacyExtendedProperty(writer: SerializationWriter, multiValueLegacyExtendedProperty: MultiValueLegacyExtendedProperty | undefined = {}) : void {
        serializeEntity(writer, multiValueLegacyExtendedProperty)
            writer.writeCollectionOfPrimitiveValues<string>("value", multiValueLegacyExtendedProperty.value);
}
