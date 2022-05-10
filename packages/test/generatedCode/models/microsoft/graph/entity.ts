
export interface Entity{
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.  */
    additionalData: Record<string, unknown>;
    /** Read-only.  */
    id?: string | undefined;
}
