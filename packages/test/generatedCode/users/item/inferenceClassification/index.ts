export * from './inferenceClassificationRequestBuilderPatchRequestConfiguration'
export * from './inferenceClassificationRequestBuilderGetRequestConfiguration'
export * from './inferenceClassificationRequestBuilderGetQueryParameters'
import {InferenceClassificationRequestBuilder } from "./inferenceClassificationRequestBuilder"
import {UserItemRequestBuilder} from "../userItemRequestBuilder"
declare module "../UserItemRequestBuilder"{
    interface UserItemRequestBuilder{
        inferenceClassification:InferenceClassificationRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "inferenceClassification", {
    configurable: true,
    enumerable: true,
    get: function(this: UserItemRequestBuilder) {
        return new InferenceClassificationRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
