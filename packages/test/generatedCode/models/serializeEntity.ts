import {Entity} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeEntity(writer: SerializationWriter, entity: Entity | undefined = {}) : void {
        for (const [key, value] of Object.entries(entity)){
            switch(key){
                case "id":
                    writer.writeStringValue("id", entity.id);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
