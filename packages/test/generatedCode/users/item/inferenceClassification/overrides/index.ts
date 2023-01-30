export * from './overridesRequestBuilderGetRequestConfiguration'
export * from './overridesRequestBuilderPostRequestConfiguration'
export * from './overridesRequestBuilderGetQueryParameters'
import {OverridesRequestBuilder } from "./overridesRequestBuilder"
import {InferenceClassificationRequestBuilder} from "./../inferenceClassificationRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../inferenceClassificationRequestBuilder"{
    interface inferenceClassificationRequestBuilder{
        overrides:OverridesRequestBuilder
    }
}
Reflect.defineProperty(InferenceClassificationRequestBuilder.prototype, "overrides", {
    configurable: true,
    enumerable: true,
    get: function(this: InferenceClassificationRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new OverridesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
