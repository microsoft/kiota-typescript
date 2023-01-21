import {createInferenceClassificationOverrideFromDiscriminatorValue} from './createInferenceClassificationOverrideFromDiscriminatorValue';
import {deserializeIntoEntity} from './deserializeIntoEntity';
import {InferenceClassification, InferenceClassificationOverride} from './index';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoInferenceClassification(inferenceClassification: InferenceClassification | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(inferenceClassification),
        "overrides": n => { inferenceClassification.overrides = n.getCollectionOfObjectValues<InferenceClassificationOverride>(createInferenceClassificationOverrideFromDiscriminatorValue); },
    }
}
