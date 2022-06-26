import {MessageImpl} from '../../../models/microsoft/graph/';
import {createMessageFromDiscriminatorValue} from '../../../models/microsoft/graph/createMessageFromDiscriminatorValue';
import {Message} from '../../../models/microsoft/graph/message';
import {MessagesResponse} from './messagesResponse';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class MessagesResponseImpl implements MessagesResponse {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    public additionalData: Record<string, unknown>;
    /** The nextLink property */
    public nextLink?: string | undefined;
    /** The value property */
    public value?: Message[] | undefined;
    /**
     * Instantiates a new messagesResponse and sets the default values.
     * @param messagesResponseParameterValue 
     */
    public constructor(messagesResponseParameterValue?: MessagesResponse | undefined) {
        this.additionalData = messagesResponseParameterValue?.additionalData ? messagesResponseParameterValue?.additionalData! : {};
        this.nextLink = messagesResponseParameterValue?.nextLink;
        this.value = messagesResponseParameterValue?.value;
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "@odata.nextLink": n => { this.nextLink = n.getStringValue(); },
            "value": n => { this.value = n.getCollectionOfObjectValues<MessageImpl>(createMessageFromDiscriminatorValue); },
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
        if(this.value && this.value.length != 0){        const valueArrValue: MessageImpl[] = []; this.value?.forEach(element => {valueArrValue.push(new MessageImpl(element));});
            writer.writeCollectionOfObjectValues<MessageImpl>("value", valueArrValue);
        }
        writer.writeAdditionalData(this.additionalData);
    };
}
