export * from './messageItemRequestBuilderPatchRequestConfiguration'
export * from './messageItemRequestBuilderDeleteRequestConfiguration'
export * from './messageItemRequestBuilderGetQueryParameters'
export * from './messageItemRequestBuilderGetRequestConfiguration'
import {MessageItemRequestBuilder } from "./messageItemRequestBuilder"
import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        messageItem:MessageItemRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messageItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MessageItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
