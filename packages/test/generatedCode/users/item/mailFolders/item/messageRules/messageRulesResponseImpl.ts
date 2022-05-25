import {MessageRuleImpl} from '../../../../../models/microsoft/graph/';
import {createMessageRuleFromDiscriminatorValue} from '../../../../../models/microsoft/graph/createMessageRuleFromDiscriminatorValue';
import {MessageRule} from '../../../../../models/microsoft/graph/messageRule';
import {MessageRulesResponse} from './messageRulesResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class MessageRulesResponseImpl implements AdditionalDataHolder, MessageRulesResponse, Parsable {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    public additionalData: Record<string, unknown>;
    /** The nextLink property */
    public nextLink?: string | undefined;
    /** The value property */
    public value?: MessageRule[] | undefined;
    /**
     * Instantiates a new messageRulesResponse and sets the default values.
     * @param messageRulesResponseParameterValue 
     */
    public constructor(messageRulesResponseParameterValue?: MessageRulesResponse | undefined) {
        this.additionalData = messageRulesResponseParameterValue?.additionalData ? messageRulesResponseParameterValue?.additionalData! : {}
        this.nextLink = messageRulesResponseParameterValue?.nextLink ;
        this.value = messageRulesResponseParameterValue?.value ;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "@odata.nextLink": n => { this.nextLink = n.getStringValue(); },
            "value": n => { this.value = n.getCollectionOfObjectValues<MessageRuleImpl>(createMessageRuleFromDiscriminatorValue); },
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
        if(this.value && this.value.length != 0){        const valueArrValue: MessageRuleImpl[] = []; this.value?.forEach(element => {valueArrValue.push(new MessageRuleImpl(element));});
            writer.writeCollectionOfObjectValues<MessageRuleImpl>("value", valueArrValue);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
