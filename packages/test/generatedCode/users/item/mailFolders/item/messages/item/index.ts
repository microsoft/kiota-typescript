export * from './messageItemRequestBuilderGetQueryParameters'
export * from './messageItemRequestBuilderPatchRequestConfiguration'
export * from './messageItemRequestBuilderDeleteRequestConfiguration'
export * from './messageItemRequestBuilderGetRequestConfiguration'
import {MessageItemRequestBuilder } from "./messageItemRequestBuilder"
import {MessagesRequestBuilder} from "../messagesRequestBuilder"
declare module "../messagesRequestBuilder"{
    interface messagesRequestBuilder{
        messageItem:MessageItemRequestBuilder
    }
}
Reflect.defineProperty(MessagesRequestBuilder.prototype, "messageItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MessagesRequestBuilder) {
        return new MessageItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
