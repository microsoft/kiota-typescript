export * from './messagesRequestBuilderPostRequestConfiguration'
export * from './messagesRequestBuilderGetRequestConfiguration'
export * from './messagesRequestBuilderGetQueryParameters'
import {MessagesRequestBuilder } from "./messagesRequestBuilder"
import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
declare module "../MailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        messages:MessagesRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messages", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder) {
        return new MessagesRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
