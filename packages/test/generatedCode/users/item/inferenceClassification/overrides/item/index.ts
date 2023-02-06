            export * from './inferenceClassificationOverrideItemRequestBuilderDeleteRequestConfiguration'
            export * from './inferenceClassificationOverrideItemRequestBuilderGetQueryParameters'
            export * from './inferenceClassificationOverrideItemRequestBuilderGetRequestConfiguration'
            export * from './inferenceClassificationOverrideItemRequestBuilderPatchRequestConfiguration'
            import {InferenceClassificationOverrideItemRequestBuilder } from "./inferenceClassificationOverrideItemRequestBuilder"
            import {InferenceClassificationRequestBuilder} from "../../inferenceClassificationRequestBuilder"
            import { getPathParameters } from "@microsoft/kiota-abstractions";
            declare module "../../inferenceClassificationRequestBuilder"{
                interface InferenceClassificationRequestBuilder{
                    overridesById:(id : string) => InferenceClassificationOverrideItemRequestBuilder
                }
            }
            Reflect.defineProperty(InferenceClassificationRequestBuilder.prototype, "overridesById", {
                configurable: true,
                enumerable: true,
                get: function() {
                    return function(this: InferenceClassificationRequestBuilder, id: string){
                        const urlTplParams = getPathParameters(this.pathParameters);
                        urlTplParams["inferenceClassificationOverride%2Did"] = id
                        return new InferenceClassificationOverrideItemRequestBuilder(urlTplParams,this.requestAdapter)
                    }
            }
        })
