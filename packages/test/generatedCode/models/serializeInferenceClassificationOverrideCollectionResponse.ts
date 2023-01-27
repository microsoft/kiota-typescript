import {InferenceClassificationOverride, InferenceClassificationOverrideCollectionResponse} from './index';
import {serializeInferenceClassificationOverride} from './serializeInferenceClassificationOverride';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeInferenceClassificationOverrideCollectionResponse(writer: SerializationWriter, inferenceClassificationOverrideCollectionResponse: InferenceClassificationOverrideCollectionResponse | undefined = {}) : void {
        for (const [key, value] of Object.entries(inferenceClassificationOverrideCollectionResponse)){
            switch(key){
                case "@odata.nextLink":
                    writer.writeStringValue("@odata.nextLink", inferenceClassificationOverrideCollectionResponse.odataNextLink);
                break
                case "value":
                    writer.writeCollectionOfObjectValues<InferenceClassificationOverride>("value", inferenceClassificationOverrideCollectionResponse.value, serializeInferenceClassificationOverride);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
