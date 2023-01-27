import {SizeRange} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeSizeRange(writer: SerializationWriter, sizeRange: SizeRange | undefined = {}) : void {
        for (const [key, value] of Object.entries(sizeRange)){
            switch(key){
                case "maximumSize":
                    writer.writeNumberValue("maximumSize", sizeRange.maximumSize);
                break
                case "minimumSize":
                    writer.writeNumberValue("minimumSize", sizeRange.minimumSize);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
