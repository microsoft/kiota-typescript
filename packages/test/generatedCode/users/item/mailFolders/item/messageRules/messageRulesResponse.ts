import {MessageRule} from '../../../../../models/microsoft/graph/messageRule';
import {AdditionalDataHolder, Parsable} from '@microsoft/kiota-abstractions';

export interface MessageRulesResponse extends Partial<AdditionalDataHolder>, Partial<Parsable> {
    /** Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well. */
    additionalData?: Record<string, unknown>;
    /** The nextLink property */
    nextLink?: string | undefined;
    /** The value property */
    value?: MessageRule[] | undefined;
}
