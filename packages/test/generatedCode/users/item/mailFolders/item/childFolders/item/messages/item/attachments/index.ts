export * from './attachmentsRequestBuilderPostRequestConfiguration'
export * from './attachmentsRequestBuilderGetQueryParameters'
export * from './attachmentsRequestBuilderGetRequestConfiguration'
import {AttachmentsRequestBuilder } from "./attachmentsRequestBuilder"
import {MessageItemRequestBuilder} from "./../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        attachments:AttachmentsRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "attachments", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new AttachmentsRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
