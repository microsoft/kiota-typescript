
export interface InternetMessageHeader{
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    additionalData?:Record<string, unknown>;
    /** Represents the key in a key-value pair. */
    name?:string | undefined;
    /** The value in a key-value pair. */
    value?:string | undefined;
}
