import {Entity} from './entity';
import {InferenceClassificationOverride} from './inferenceClassificationOverride';

export interface InferenceClassification extends Entity{
    /** A set of overrides for a user to always classify messages from specific senders in certain ways: focused, or other. Read-only. Nullable.  */
    overrides?: InferenceClassificationOverride[] | undefined;
}
