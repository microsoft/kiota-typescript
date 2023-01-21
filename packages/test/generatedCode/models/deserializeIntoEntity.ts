import {Entity} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoEntity(entity: Entity | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "id": n => { entity.id = n.getStringValue(); },
    }
}
