import {Message} from '../../../../../models/microsoft/graph/';
import {createMessageFromDiscriminatorValue} from '../../../../../models/microsoft/graph/createMessageFromDiscriminatorValue';
import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class MessagesResponse implements AdditionalDataHolder, Parsable {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.  */
    private _additionalData: Record<string, unknown>;
    private _nextLink?: string | undefined;
    private _value?: Message[] | undefined;
    /**
     * Gets the additionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
     * @returns a Record<string, unknown>
     */
    public get additionalData() {
        return this._additionalData;
    };
    /**
     * Sets the additionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
     * @param value Value to set for the AdditionalData property.
     */
    public set additionalData(value: Record<string, unknown>) {
        this._additionalData = value;
    };
    /**
     * Instantiates a new messagesResponse and sets the default values.
     */
    public constructor() {
        this._additionalData = {};
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (item: T, node: ParseNode) => void>
     */
    public getFieldDeserializers<T>() : Record<string, (item: T, node: ParseNode) => void> {
        return {
            "@odata.nextLink": (o, n) => { (o as unknown as MessagesResponse).nextLink = n.getStringValue(); },
            "value": (o, n) => { (o as unknown as MessagesResponse).value = n.getCollectionOfObjectValues<Message>(createMessageFromDiscriminatorValue); },
        };
    };
    /**
     * Gets the @odata.nextLink property value. 
     * @returns a string
     */
    public get nextLink() {
        return this._nextLink;
    };
    /**
     * Sets the @odata.nextLink property value. 
     * @param value Value to set for the nextLink property.
     */
    public set nextLink(value: string | undefined) {
        this._nextLink = value;
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        writer.writeStringValue("@odata.nextLink", this.nextLink);
        writer.writeCollectionOfObjectValues<Message>("value", this.value);
        writer.writeAdditionalData(this.additionalData);
    };
    /**
     * Gets the value property value. 
     * @returns a message
     */
    public get value() {
        return this._value;
    };
    /**
     * Sets the value property value. 
     * @param value Value to set for the value property.
     */
    public set value(value: Message[] | undefined) {
        this._value = value;
    };
}
