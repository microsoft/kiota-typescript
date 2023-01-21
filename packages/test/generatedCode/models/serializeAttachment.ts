import {Attachment} from './index';
import {serializeEntity} from './serializeEntity';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeAttachment(writer: SerializationWriter, attachment: Attachment | undefined = {}) : void {
        serializeEntity(writer, attachment)
            writer.writeStringValue("contentType", attachment.contentType);
            writer.writeBooleanValue("isInline", attachment.isInline);
            writer.writeDateValue("lastModifiedDateTime", attachment.lastModifiedDateTime);
            writer.writeStringValue("name", attachment.name);
            writer.writeNumberValue("size", attachment.size);
}
