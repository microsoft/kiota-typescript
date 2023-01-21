import {createEmailAddressFromDiscriminatorValue} from './createEmailAddressFromDiscriminatorValue';
import {deserializeIntoEntity} from './deserializeIntoEntity';
import {EmailAddress, InferenceClassificationOverride} from './index';
import {InferenceClassificationType} from './inferenceClassificationType';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoInferenceClassificationOverride(inferenceClassificationOverride: InferenceClassificationOverride | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(inferenceClassificationOverride),
        "classifyAs": n => { inferenceClassificationOverride.classifyAs = n.getEnumValue<InferenceClassificationType>(InferenceClassificationType); },
        "senderEmailAddress": n => { inferenceClassificationOverride.senderEmailAddress = n.getObjectValue<EmailAddress>(createEmailAddressFromDiscriminatorValue); },
    }
}
