import {InferenceClassificationOverrideImpl} from '../../../../models/microsoft/graph/';
import {createInferenceClassificationOverrideFromDiscriminatorValue} from '../../../../models/microsoft/graph/createInferenceClassificationOverrideFromDiscriminatorValue';
import {InferenceClassificationOverride} from '../../../../models/microsoft/graph/inferenceClassificationOverride';
import {OverridesResponse} from './overridesResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class OverridesResponseImpl implements AdditionalDataHolder, OverridesResponse, Parsable {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    public additionalData: Record<string, unknown>;
    /** The nextLink property */
    public nextLink?: string | undefined;
    /** The value property */
    public value?: InferenceClassificationOverride[] | undefined;
    /**
     * Instantiates a new overridesResponse and sets the default values.
     * @param overridesResponseParameterValue 
     */
    public constructor(overridesResponseParameterValue?: OverridesResponse | undefined) {
        this.additionalData = overridesResponseParameterValue?.additionalData ? overridesResponseParameterValue?.additionalData! : {}
        this.nextLink = overridesResponseParameterValue?.nextLink ;
        this.value = overridesResponseParameterValue?.value ;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "@odata.nextLink": n => { this.nextLink = n.getStringValue(); },
            "value": n => { this.value = n.getCollectionOfObjectValues<InferenceClassificationOverrideImpl>(createInferenceClassificationOverrideFromDiscriminatorValue); },
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
        if(this.value && this.value.length != 0){        const valueArrValue: InferenceClassificationOverrideImpl[] = []; this.value?.forEach(element => {valueArrValue.push(new InferenceClassificationOverrideImpl(element));});
            writer.writeCollectionOfObjectValues<InferenceClassificationOverrideImpl>("value", valueArrValue);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
