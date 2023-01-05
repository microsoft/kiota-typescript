import {InferenceClassification, InferenceClassificationOverride} from './index';
import {serializeEntity} from './serializeEntity';
import {serializeInferenceClassificationOverride} from './serializeInferenceClassificationOverride';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeInferenceClassification(writer: SerializationWriter, inferenceClassification: InferenceClassification | undefined = {}) : void {
        serializeEntity(writer, inferenceClassification)
            writer.writeCollectionOfObjectValues<InferenceClassificationOverride>("overrides", inferenceClassification.overrides, serializeInferenceClassificationOverride);
}
