    export * from './inferenceClassificationRequestBuilderGetRequestConfiguration'
    export * from './inferenceClassificationRequestBuilderGetQueryParameters'
    export * from './inferenceClassificationRequestBuilderPatchRequestConfiguration'
    import {InferenceClassificationRequestBuilder } from "./inferenceClassificationRequestBuilder"
    import {UserItemRequestBuilder} from "../userItemRequestBuilder"
    declare module "../userItemRequestBuilder"{
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
