import {EmailAddress, InferenceClassificationOverride} from './index';
import {InferenceClassificationType} from './inferenceClassificationType';
import {serializeEmailAddress} from './serializeEmailAddress';
import {serializeEntity} from './serializeEntity';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeInferenceClassificationOverride(writer: SerializationWriter, inferenceClassificationOverride: InferenceClassificationOverride | undefined = {}) : void {
        serializeEntity(writer, inferenceClassificationOverride)
        for (const [key, value] of Object.entries(inferenceClassificationOverride)){
            switch(key){
                case "classifyAs":
                    writer.writeEnumValue<InferenceClassificationType>("classifyAs", inferenceClassificationOverride.classifyAs);
                break
                case "senderEmailAddress":
                    writer.writeObjectValue<EmailAddress>("senderEmailAddress", inferenceClassificationOverride.senderEmailAddress, serializeEmailAddress);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
