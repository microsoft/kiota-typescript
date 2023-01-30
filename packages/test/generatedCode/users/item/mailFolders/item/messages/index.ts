export * from './messagesRequestBuilderPostRequestConfiguration'
export * from './messagesRequestBuilderGetRequestConfiguration'
export * from './messagesRequestBuilderGetQueryParameters'
import {MessagesRequestBuilder } from "./messagesRequestBuilder"
import {MailFolderItemRequestBuilder} from "./../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        messages:MessagesRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messages", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MessagesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
