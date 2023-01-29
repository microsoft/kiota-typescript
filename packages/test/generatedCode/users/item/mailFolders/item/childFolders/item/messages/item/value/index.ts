export * from './contentRequestBuilderPutRequestConfiguration'
export * from './contentRequestBuilderGetRequestConfiguration'
import {ContentRequestBuilder } from "./contentRequestBuilder"
import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
declare module "../MessageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        content:ContentRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "content", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder) {
        return new ContentRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
