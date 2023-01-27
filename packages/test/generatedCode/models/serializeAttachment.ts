import {Attachment} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeAttachment(writer: SerializationWriter, attachment: Attachment | undefined = {}) : void {
        serializeEntity(writer, attachment)
        for (const [key, value] of Object.entries(attachment)){
            switch(key){
                case "contentType":
                    writer.writeStringValue("contentType", attachment.contentType);
                break
                case "isInline":
                    writer.writeBooleanValue("isInline", attachment.isInline);
                break
                case "lastModifiedDateTime":
                    writer.writeDateValue("lastModifiedDateTime", attachment.lastModifiedDateTime);
                break
                case "name":
                    writer.writeStringValue("name", attachment.name);
                break
                case "size":
                    writer.writeNumberValue("size", attachment.size);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
