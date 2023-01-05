import {Extension} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeExtension(writer: SerializationWriter, extension: Extension | undefined = {}) : void {
        serializeEntity(writer, extension)
}
