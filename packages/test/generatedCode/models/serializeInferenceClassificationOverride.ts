import {EmailAddress, InferenceClassificationOverride} from './index';
import {InferenceClassificationType} from './inferenceClassificationType';
import {serializeEmailAddress} from './serializeEmailAddress';
import {serializeEntity} from './serializeEntity';
import {DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeInferenceClassificationOverride(writer: SerializationWriter, inferenceClassificationOverride: InferenceClassificationOverride | undefined = {}) : void {
        serializeEntity(writer, inferenceClassificationOverride)
            writer.writeEnumValue<InferenceClassificationType>("classifyAs", inferenceClassificationOverride.classifyAs);
            writer.writeObjectValue<EmailAddress>("senderEmailAddress", inferenceClassificationOverride.senderEmailAddress, serializeEmailAddress);
}
