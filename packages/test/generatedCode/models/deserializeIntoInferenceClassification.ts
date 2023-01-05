import {deserializeIntoEntity} from './deserializeIntoEntity';
import {deserializeIntoInferenceClassificationOverride} from './deserializeIntoInferenceClassificationOverride';
import {InferenceClassification, InferenceClassificationOverride} from './index';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoInferenceClassification(inferenceClassification: InferenceClassification | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(inferenceClassification),
        "overrides": n => { inferenceClassification.overrides = n.getCollectionOfObjectValues<InferenceClassificationOverride>(deserializeIntoInferenceClassificationOverride); },
    }
}
