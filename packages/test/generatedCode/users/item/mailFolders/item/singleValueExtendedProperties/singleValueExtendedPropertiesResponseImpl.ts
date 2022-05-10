import {SingleValueLegacyExtendedPropertyImpl} from '../../../../../models/microsoft/graph/';
import {createSingleValueLegacyExtendedPropertyFromDiscriminatorValue} from '../../../../../models/microsoft/graph/createSingleValueLegacyExtendedPropertyFromDiscriminatorValue';
import {SingleValueLegacyExtendedProperty} from '../../../../../models/microsoft/graph/singleValueLegacyExtendedProperty';
import {SingleValueExtendedPropertiesResponse} from './singleValueExtendedPropertiesResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class SingleValueExtendedPropertiesResponseImpl implements AdditionalDataHolder, Parsable, SingleValueExtendedPropertiesResponse {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.  */
    additionalData: Record<string, unknown>;
    /** The nextLink property  */
    nextLink?: string | undefined;
    /** The value property  */
    value?: SingleValueLegacyExtendedProperty[] | undefined;
    /**
     * Instantiates a new singleValueExtendedPropertiesResponse and sets the default values.
     * @param singleValueExtendedPropertiesResponseParameterValue 
     */
    public constructor(singleValueExtendedPropertiesResponseParameterValue?: SingleValueExtendedPropertiesResponse | undefined) {
        this.additionalData = {};
        this.additionalData = singleValueExtendedPropertiesResponseParameterValue?.additionalData ? {} : singleValueExtendedPropertiesResponseParameterValue?.additionalData!
        this.nextLink = singleValueExtendedPropertiesResponseParameterValue?.nextLink ;
        this.value = singleValueExtendedPropertiesResponseParameterValue?.value ;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "@odata.nextLink": n => { this.nextLink = n.getStringValue(); },
            "value": n => { this.value = n.getCollectionOfObjectValues<SingleValueLegacyExtendedPropertyImpl>(createSingleValueLegacyExtendedPropertyFromDiscriminatorValue); },
        };
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        if(this.nextLink){
        if(this.nextLink)
        writer.writeStringValue("@odata.nextLink", this.nextLink);
        }
        if(this.value){
        const valueArrValue: SingleValueLegacyExtendedPropertyImpl[] = []; this.value?.forEach(element => {valueArrValue.push(new SingleValueLegacyExtendedPropertyImpl(element));});
        writer.writeCollectionOfObjectValues<SingleValueLegacyExtendedPropertyImpl>("value", valueArrValue);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
