import {OutlookItem} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeOutlookItem(writer: SerializationWriter, outlookItem: OutlookItem | undefined = {}) : void {
        serializeEntity(writer, outlookItem)
        for (const [key, value] of Object.entries(outlookItem)){
            switch(key){
                case "categories":
                    writer.writeCollectionOfPrimitiveValues<string>("categories", outlookItem.categories);
                break
                case "changeKey":
                    writer.writeStringValue("changeKey", outlookItem.changeKey);
                break
                case "createdDateTime":
                    writer.writeDateValue("createdDateTime", outlookItem.createdDateTime);
                break
                case "lastModifiedDateTime":
                    writer.writeDateValue("lastModifiedDateTime", outlookItem.lastModifiedDateTime);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
