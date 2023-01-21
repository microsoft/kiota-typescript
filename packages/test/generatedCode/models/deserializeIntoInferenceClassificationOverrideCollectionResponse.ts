import {createInferenceClassificationOverrideFromDiscriminatorValue} from './createInferenceClassificationOverrideFromDiscriminatorValue';
import {InferenceClassificationOverride, InferenceClassificationOverrideCollectionResponse} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoInferenceClassificationOverrideCollectionResponse(inferenceClassificationOverrideCollectionResponse: InferenceClassificationOverrideCollectionResponse | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "@odata.nextLink": n => { inferenceClassificationOverrideCollectionResponse.odataNextLink = n.getStringValue(); },
        "value": n => { inferenceClassificationOverrideCollectionResponse.value = n.getCollectionOfObjectValues<InferenceClassificationOverride>(createInferenceClassificationOverrideFromDiscriminatorValue); },
    }
}
