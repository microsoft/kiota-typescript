import {AdditionalDataHolder, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export class SizeRange implements AdditionalDataHolder, Parsable {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.  */
    private _additionalData: Record<string, unknown>;
    /** The maximum size (in kilobytes) that an incoming message must have in order for a condition or exception to apply.  */
    private _maximumSize?: number | undefined;
    /** The minimum size (in kilobytes) that an incoming message must have in order for a condition or exception to apply.  */
    private _minimumSize?: number | undefined;
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
     * Instantiates a new sizeRange and sets the default values.
     */
    public constructor() {
        this._additionalData = {};
    };
    /**
     * The deserialization information for the current model
     * @returns a Record<string, (node: ParseNode) => void>
     */
    public getFieldDeserializers() : Record<string, (node: ParseNode) => void> {
        return {
            "maximumSize": n => { this.maximumSize = n.getNumberValue(); },
            "minimumSize": n => { this.minimumSize = n.getNumberValue(); },
        };
    };
    /**
     * Gets the maximumSize property value. The maximum size (in kilobytes) that an incoming message must have in order for a condition or exception to apply.
     * @returns a integer
     */
    public get maximumSize() {
        return this._maximumSize;
    };
    /**
     * Sets the maximumSize property value. The maximum size (in kilobytes) that an incoming message must have in order for a condition or exception to apply.
     * @param value Value to set for the maximumSize property.
     */
    public set maximumSize(value: number | undefined) {
        this._maximumSize = value;
    };
    /**
     * Gets the minimumSize property value. The minimum size (in kilobytes) that an incoming message must have in order for a condition or exception to apply.
     * @returns a integer
     */
    public get minimumSize() {
        return this._minimumSize;
    };
    /**
     * Sets the minimumSize property value. The minimum size (in kilobytes) that an incoming message must have in order for a condition or exception to apply.
     * @param value Value to set for the minimumSize property.
     */
    public set minimumSize(value: number | undefined) {
        this._minimumSize = value;
    };
    /**
     * Serializes information the current object
     * @param writer Serialization writer to use to serialize this model
     */
    public serialize(writer: SerializationWriter) : void {
        if(!writer) throw new Error("writer cannot be undefined");
        writer.writeNumberValue("maximumSize", this.maximumSize);
        writer.writeNumberValue("minimumSize", this.minimumSize);
        writer.writeAdditionalData(this.additionalData);
    };
}
