import {InternetMessageHeader} from './internetMessageHeader';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class InternetMessageHeaderImpl implements AdditionalDataHolder, InternetMessageHeader, Parsable {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.  */
    additionalData: Record<string, unknown>;
    /** Represents the key in a key-value pair.  */
    name?: string | undefined;
    /** The value in a key-value pair.  */
    value?: string | undefined;
    /**
     * Instantiates a new internetMessageHeader and sets the default values.
     * @param internetMessageHeaderParameterValue 
     */
    public constructor(internetMessageHeaderParameterValue?: InternetMessageHeader | undefined) {
        this.additionalData = {};
        this.additionalData = internetMessageHeaderParameterValue?.additionalData ? {} : internetMessageHeaderParameterValue?.additionalData!
        this.name = internetMessageHeaderParameterValue?.name ;
        this.value = internetMessageHeaderParameterValue?.value ;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "name": n => { this.name = n.getStringValue(); },
            "value": n => { this.value = n.getStringValue(); },
        };
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        if(this.name){
        if(this.name)
        writer.writeStringValue("name", this.name);
        }
        if(this.value){
        if(this.value)
        writer.writeStringValue("value", this.value);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
