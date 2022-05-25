import {EmailAddress} from './emailAddress';
import {Entity} from './entity';
import {InferenceClassificationType} from './inferenceClassificationType';

export interface InferenceClassificationOverride extends Entity {
    /** The classifyAs property */
    classifyAs?: InferenceClassificationType | undefined;
    /** The senderEmailAddress property */
    senderEmailAddress?: EmailAddress | undefined;
}
