import {deserializeIntoEntity} from './deserializeIntoEntity';
import {Extension} from './index';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoExtension(extension: Extension | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(extension),
    }
}
