import {Entity, InferenceClassificationOverride} from './index';
import {Parsable} from '@microsoft/kiota-abstractions';

export interface InferenceClassification extends Entity, Partial<Parsable> {
    /** A set of overrides for a user to always classify messages from specific senders in certain ways: focused, or other. Read-only. Nullable. */
    overrides?: InferenceClassificationOverride[] | undefined;
}
