import {InternetMessageHeader} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeInternetMessageHeader(writer: SerializationWriter, internetMessageHeader: InternetMessageHeader | undefined = {}) : void {
        for (const [key, value] of Object.entries(internetMessageHeader)){
            switch(key){
                case "name":
                    writer.writeStringValue("name", internetMessageHeader.name);
                break
                case "value":
                    writer.writeStringValue("value", internetMessageHeader.value);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
