import {deserializeIntoEntity} from './deserializeIntoEntity';
import {Extension} from './extension';
import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoExtension(extension: Extension | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(extension),
    }
}
