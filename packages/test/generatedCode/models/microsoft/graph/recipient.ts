import {EmailAddress} from './emailAddress';

export interface Recipient{
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    additionalData?:Record<string, unknown>;
    /** The emailAddress property */
    emailAddress?:EmailAddress | undefined;
}
