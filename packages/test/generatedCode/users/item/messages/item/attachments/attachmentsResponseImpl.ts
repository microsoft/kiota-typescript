import {AttachmentImpl} from '../../../../../models/microsoft/graph/';
import {Attachment} from '../../../../../models/microsoft/graph/attachment';
import {createAttachmentFromDiscriminatorValue} from '../../../../../models/microsoft/graph/createAttachmentFromDiscriminatorValue';
import {AttachmentsResponse} from './attachmentsResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class AttachmentsResponseImpl implements AdditionalDataHolder, AttachmentsResponse, Parsable {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    public additionalData: Record<string, unknown>;
    /** The nextLink property */
    public nextLink?: string | undefined;
    /** The value property */
    public value?: Attachment[] | undefined;
    /**
     * Instantiates a new attachmentsResponse and sets the default values.
     * @param attachmentsResponseParameterValue 
     */
    public constructor(attachmentsResponseParameterValue?: AttachmentsResponse | undefined) {
        this.additionalData = attachmentsResponseParameterValue?.additionalData ? attachmentsResponseParameterValue?.additionalData! : {};
        this.nextLink = attachmentsResponseParameterValue?.nextLink;
        this.value = attachmentsResponseParameterValue?.value;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "@odata.nextLink": n => { this.nextLink = n.getStringValue(); },
            "value": n => { this.value = n.getCollectionOfObjectValues<AttachmentImpl>(createAttachmentFromDiscriminatorValue); },
        };
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        if(this.nextLink){
            writer.writeStringValue("@odata.nextLink", this.nextLink);
        }
        if(this.value && this.value.length != 0){        const valueArrValue: AttachmentImpl[] = []; this.value?.forEach(element => {valueArrValue.push(new AttachmentImpl(element));});
            writer.writeCollectionOfObjectValues<AttachmentImpl>("value", valueArrValue);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
