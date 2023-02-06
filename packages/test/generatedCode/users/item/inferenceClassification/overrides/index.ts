        export * from './overridesRequestBuilderPostRequestConfiguration'
        export * from './overridesRequestBuilderGetRequestConfiguration'
        export * from './overridesRequestBuilderGetQueryParameters'
        import {OverridesRequestBuilder } from "./overridesRequestBuilder"
        import {InferenceClassificationRequestBuilder} from "../inferenceClassificationRequestBuilder"
        declare module "../inferenceClassificationRequestBuilder"{
            interface InferenceClassificationRequestBuilder{
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
