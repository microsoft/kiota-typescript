    export * from './multiValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
    export * from './multiValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
    export * from './multiValueExtendedPropertiesRequestBuilderGetQueryParameters'
    import {MultiValueExtendedPropertiesRequestBuilder } from "./multiValueExtendedPropertiesRequestBuilder"
    import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
    declare module "../messageItemRequestBuilder"{
        interface MessageItemRequestBuilder{
            multiValueExtendedProperties:MultiValueExtendedPropertiesRequestBuilder
        }
    }
    Reflect.defineProperty(MessageItemRequestBuilder.prototype, "multiValueExtendedProperties", {
        configurable: true,
        enumerable: true,
        get: function(this: MessageItemRequestBuilder) {
            return new MultiValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
            }
        })
