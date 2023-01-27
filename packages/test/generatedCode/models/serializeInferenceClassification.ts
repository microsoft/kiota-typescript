import {InferenceClassification, InferenceClassificationOverride} from './index';
import {serializeEntity} from './serializeEntity';
import {serializeInferenceClassificationOverride} from './serializeInferenceClassificationOverride';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeInferenceClassification(writer: SerializationWriter, inferenceClassification: InferenceClassification | undefined = {}) : void {
        serializeEntity(writer, inferenceClassification)
        for (const [key, value] of Object.entries(inferenceClassification)){
            switch(key){
                case "overrides":
                    writer.writeCollectionOfObjectValues<InferenceClassificationOverride>("overrides", inferenceClassification.overrides, serializeInferenceClassificationOverride);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
