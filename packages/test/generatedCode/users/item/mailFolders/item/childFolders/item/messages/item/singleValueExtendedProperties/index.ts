export * from './singleValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './singleValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
export * from './singleValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
import {SingleValueExtendedPropertiesRequestBuilder } from "./singleValueExtendedPropertiesRequestBuilder"
import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
declare module "../MessageItemRequestBuilder"{
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
