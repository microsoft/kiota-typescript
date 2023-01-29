export * from './inferenceClassificationOverrideItemRequestBuilderPatchRequestConfiguration'
export * from './inferenceClassificationOverrideItemRequestBuilderGetQueryParameters'
export * from './inferenceClassificationOverrideItemRequestBuilderGetRequestConfiguration'
export * from './inferenceClassificationOverrideItemRequestBuilderDeleteRequestConfiguration'
import {InferenceClassificationOverrideItemRequestBuilder } from "./inferenceClassificationOverrideItemRequestBuilder"
import {OverridesRequestBuilder} from "../overridesRequestBuilder"
declare module "../overridesRequestBuilder"{
    interface overridesRequestBuilder{
        inferenceClassificationOverrideItem:InferenceClassificationOverrideItemRequestBuilder
    }
}
Reflect.defineProperty(OverridesRequestBuilder.prototype, "inferenceClassificationOverrideItem", {
    configurable: true,
    enumerable: true,
    get: function(this: OverridesRequestBuilder) {
        return new InferenceClassificationOverrideItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
