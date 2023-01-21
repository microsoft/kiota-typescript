import {SizeRange} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSizeRange(writer: SerializationWriter, sizeRange: SizeRange | undefined = {}) : void {
            writer.writeNumberValue("maximumSize", sizeRange.maximumSize);
            writer.writeNumberValue("minimumSize", sizeRange.minimumSize);
}
