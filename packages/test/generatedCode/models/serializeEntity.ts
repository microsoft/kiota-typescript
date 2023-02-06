import {Entity} from './entity';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeEntity(writer: SerializationWriter, entity: Entity | undefined = {}) : void {
        writer.writeStringValue("id", entity.id);
        writer.writeAdditionalData(entity.additionalData);
}
