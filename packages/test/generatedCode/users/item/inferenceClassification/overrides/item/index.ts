export * from './inferenceClassificationOverrideItemRequestBuilderGetQueryParameters'
export * from './inferenceClassificationOverrideItemRequestBuilderDeleteRequestConfiguration'
export * from './inferenceClassificationOverrideItemRequestBuilderPatchRequestConfiguration'
export * from './inferenceClassificationOverrideItemRequestBuilderGetRequestConfiguration'
import {InferenceClassificationOverrideItemRequestBuilder } from "./inferenceClassificationOverrideItemRequestBuilder"
import {InferenceClassificationRequestBuilder} from "../../inferenceClassificationRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../inferenceClassificationRequestBuilder"{
    interface inferenceClassificationRequestBuilder{
        inferenceClassificationOverrideItem:InferenceClassificationOverrideItemRequestBuilder
    }
}
Reflect.defineProperty(InferenceClassificationRequestBuilder.prototype, "inferenceClassificationOverrideItem", {
    configurable: true,
    enumerable: true,
    get: function(this: InferenceClassificationRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new InferenceClassificationOverrideItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
