export * from './inferenceClassificationRequestBuilderGetRequestConfiguration'
export * from './inferenceClassificationRequestBuilderPatchRequestConfiguration'
export * from './inferenceClassificationRequestBuilderGetQueryParameters'
import {InferenceClassificationRequestBuilder } from "./inferenceClassificationRequestBuilder"
import {UserItemRequestBuilder} from "./../userItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../userItemRequestBuilder"{
    interface UserItemRequestBuilder{
        inferenceClassification:InferenceClassificationRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "inferenceClassification", {
    configurable: true,
    enumerable: true,
    get: function(this: UserItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new InferenceClassificationRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
