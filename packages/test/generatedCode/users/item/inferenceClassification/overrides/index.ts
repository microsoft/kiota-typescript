export * from './overridesRequestBuilderGetQueryParameters'
export * from './overridesRequestBuilderGetRequestConfiguration'
export * from './overridesRequestBuilderPostRequestConfiguration'
import {OverridesRequestBuilder } from "./overridesRequestBuilder"
import {InferenceClassificationRequestBuilder} from "../inferenceClassificationRequestBuilder"
declare module "../inferenceClassificationRequestBuilder"{
    interface inferenceClassificationRequestBuilder{
        overrides:OverridesRequestBuilder
    }
}
Reflect.defineProperty(InferenceClassificationRequestBuilder.prototype, "overrides", {
    configurable: true,
    enumerable: true,
    get: function(this: InferenceClassificationRequestBuilder) {
        return new OverridesRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
