export * from './attachmentItemRequestBuilderGetRequestConfiguration'
export * from './attachmentItemRequestBuilderDeleteRequestConfiguration'
export * from './attachmentItemRequestBuilderGetQueryParameters'
import {AttachmentItemRequestBuilder } from "./attachmentItemRequestBuilder"
import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        attachmentItem:AttachmentItemRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "attachmentItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new AttachmentItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
