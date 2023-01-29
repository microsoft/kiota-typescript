export * from './messagesRequestBuilderPostRequestConfiguration'
export * from './messagesRequestBuilderGetRequestConfiguration'
export * from './messagesRequestBuilderGetQueryParameters'
import {MessagesRequestBuilder } from "./messagesRequestBuilder"
import {UserItemRequestBuilder} from "../userItemRequestBuilder"
declare module "../UserItemRequestBuilder"{
    interface UserItemRequestBuilder{
        messages:MessagesRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "messages", {
    configurable: true,
    enumerable: true,
    get: function(this: UserItemRequestBuilder) {
        return new MessagesRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
