import {MailFolder} from '../../../../../models/microsoft/graph/mailFolder';

export interface ChildFoldersResponse{
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.  */
    additionalData: Record<string, unknown>;
    /** The nextLink property  */
    nextLink?: string | undefined;
    /** The value property  */
    value?: MailFolder[] | undefined;
}
