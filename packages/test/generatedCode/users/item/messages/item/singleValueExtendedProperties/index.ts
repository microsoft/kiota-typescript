    export * from './singleValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
    export * from './singleValueExtendedPropertiesRequestBuilderGetQueryParameters'
    export * from './singleValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
    import {SingleValueExtendedPropertiesRequestBuilder } from "./singleValueExtendedPropertiesRequestBuilder"
    import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
    declare module "../messageItemRequestBuilder"{
        interface MessageItemRequestBuilder{
            singleValueExtendedProperties:SingleValueExtendedPropertiesRequestBuilder
        }
    }
    Reflect.defineProperty(MessageItemRequestBuilder.prototype, "singleValueExtendedProperties", {
        configurable: true,
        enumerable: true,
        get: function(this: MessageItemRequestBuilder) {
            return new SingleValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
            }
        })
