export * from './multiValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './multiValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
export * from './multiValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
import {MultiValueExtendedPropertiesRequestBuilder } from "./multiValueExtendedPropertiesRequestBuilder"
import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
declare module "../MessageItemRequestBuilder"{
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
