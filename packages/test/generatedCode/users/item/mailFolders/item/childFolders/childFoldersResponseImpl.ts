import {MailFolderImpl} from '../../../../../models/microsoft/graph/';
import {createMailFolderFromDiscriminatorValue} from '../../../../../models/microsoft/graph/createMailFolderFromDiscriminatorValue';
import {MailFolder} from '../../../../../models/microsoft/graph/mailFolder';
import {ChildFoldersResponse} from './childFoldersResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class ChildFoldersResponseImpl implements ChildFoldersResponse {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    public additionalData: Record<string, unknown>;
    /** The nextLink property */
    public nextLink?: string | undefined;
    /** The value property */
    public value?: MailFolder[] | undefined;
    /**
     * Instantiates a new childFoldersResponse and sets the default values.
     * @param childFoldersResponseParameterValue 
     */
    public constructor(childFoldersResponseParameterValue?: ChildFoldersResponse | undefined) {
        this.additionalData = childFoldersResponseParameterValue?.additionalData ? childFoldersResponseParameterValue?.additionalData! : {};
        this.nextLink = childFoldersResponseParameterValue?.nextLink;
        this.value = childFoldersResponseParameterValue?.value;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "@odata.nextLink": n => { this.nextLink = n.getStringValue(); },
            "value": n => { this.value = n.getCollectionOfObjectValues<MailFolderImpl>(createMailFolderFromDiscriminatorValue); },
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
        if(this.value && this.value.length != 0){        const valueArrValue: MailFolderImpl[] = []; this.value?.forEach(element => {valueArrValue.push(new MailFolderImpl(element));});
            writer.writeCollectionOfObjectValues<MailFolderImpl>("value", valueArrValue);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
