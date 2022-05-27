import {ExtensionImpl} from '../../../../../../../models/microsoft/graph/';
import {createExtensionFromDiscriminatorValue} from '../../../../../../../models/microsoft/graph/createExtensionFromDiscriminatorValue';
import {Extension} from '../../../../../../../models/microsoft/graph/extension';
import {ExtensionsResponse} from './extensionsResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class ExtensionsResponseImpl implements AdditionalDataHolder, ExtensionsResponse, Parsable {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    public additionalData: Record<string, unknown>;
    /** The nextLink property */
    public nextLink?: string | undefined;
    /** The value property */
    public value?: Extension[] | undefined;
    /**
     * Instantiates a new extensionsResponse and sets the default values.
     * @param extensionsResponseParameterValue 
     */
    public constructor(extensionsResponseParameterValue?: ExtensionsResponse | undefined) {
        this.additionalData = extensionsResponseParameterValue?.additionalData ? extensionsResponseParameterValue?.additionalData! : {};
        this.nextLink = extensionsResponseParameterValue?.nextLink;
        this.value = extensionsResponseParameterValue?.value;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "@odata.nextLink": n => { this.nextLink = n.getStringValue(); },
            "value": n => { this.value = n.getCollectionOfObjectValues<ExtensionImpl>(createExtensionFromDiscriminatorValue); },
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
        if(this.value && this.value.length != 0){        const valueArrValue: ExtensionImpl[] = []; this.value?.forEach(element => {valueArrValue.push(new ExtensionImpl(element));});
            writer.writeCollectionOfObjectValues<ExtensionImpl>("value", valueArrValue);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
