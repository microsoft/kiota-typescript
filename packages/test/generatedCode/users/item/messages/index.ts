export * from './messagesRequestBuilderPostRequestConfiguration'
export * from './messagesRequestBuilderGetRequestConfiguration'
export * from './messagesRequestBuilderGetQueryParameters'
import {MessagesRequestBuilder } from "./messagesRequestBuilder"
import {UserItemRequestBuilder} from "./../userItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../userItemRequestBuilder"{
    interface UserItemRequestBuilder{
        messages:MessagesRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "messages", {
    configurable: true,
    enumerable: true,
    get: function(this: UserItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MessagesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
