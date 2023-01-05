import {InternetMessageHeader} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeInternetMessageHeader(writer: SerializationWriter, internetMessageHeader: InternetMessageHeader | undefined = {}) : void {
            writer.writeStringValue("name", internetMessageHeader.name);
            writer.writeStringValue("value", internetMessageHeader.value);
}
