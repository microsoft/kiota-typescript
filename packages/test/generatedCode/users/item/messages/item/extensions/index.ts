export * from './extensionsRequestBuilderPostRequestConfiguration'
export * from './extensionsRequestBuilderGetRequestConfiguration'
export * from './extensionsRequestBuilderGetQueryParameters'
import {ExtensionsRequestBuilder } from "./extensionsRequestBuilder"
import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
declare module "../MessageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        extensions:ExtensionsRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "extensions", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder) {
        return new ExtensionsRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
