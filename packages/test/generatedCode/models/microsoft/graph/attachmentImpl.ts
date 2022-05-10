import {Attachment} from './attachment';
import {EntityImpl} from './index';
import {Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class AttachmentImpl extends EntityImpl implements Attachment, Parsable {
    /** The MIME type.  */
    contentType?: string | undefined;
    /** true if the attachment is an inline attachment; otherwise, false.  */
    isInline?: boolean | undefined;
    /** The Timestamp type represents date and time information using ISO 8601 format and is always in UTC time. For example, midnight UTC on Jan 1, 2014 is 2014-01-01T00:00:00Z  */
    lastModifiedDateTime?: Date | undefined;
    /** The attachment's file name.  */
    name?: string | undefined;
    /** The length of the attachment in bytes.  */
    size?: number | undefined;
    /**
     * Instantiates a new attachment and sets the default values.
     * @param attachmentParameterValue 
     */
    public constructor(attachmentParameterValue?: Attachment | undefined) {
        super();
        this.contentType = attachmentParameterValue?.contentType ;
        this.isInline = attachmentParameterValue?.isInline ;
        this.lastModifiedDateTime = attachmentParameterValue?.lastModifiedDateTime ;
        this.name = attachmentParameterValue?.name ;
        this.size = attachmentParameterValue?.size ;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {...super.getFieldDeserializers(),
            "contentType": n => { this.contentType = n.getStringValue(); },
            "isInline": n => { this.isInline = n.getBooleanValue(); },
            "lastModifiedDateTime": n => { this.lastModifiedDateTime = n.getDateValue(); },
            "name": n => { this.name = n.getStringValue(); },
            "size": n => { this.size = n.getNumberValue(); },
        };
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        super.serialize(writer);
        if(this.contentType){
        if(this.contentType)
        writer.writeStringValue("contentType", this.contentType);
        }
        if(this.isInline){
        if(this.isInline)
        writer.writeBooleanValue("isInline", this.isInline);
        }
        if(this.lastModifiedDateTime){
        if(this.lastModifiedDateTime)
        writer.writeDateValue("lastModifiedDateTime", this.lastModifiedDateTime);
        }
        if(this.name){
        if(this.name)
        writer.writeStringValue("name", this.name);
        }
        if(this.size){
        if(this.size)
        writer.writeNumberValue("size", this.size);
        }
    };
}
