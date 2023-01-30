export * from './extensionItemRequestBuilderDeleteRequestConfiguration'
export * from './extensionItemRequestBuilderPatchRequestConfiguration'
export * from './extensionItemRequestBuilderGetQueryParameters'
export * from './extensionItemRequestBuilderGetRequestConfiguration'
import {ExtensionItemRequestBuilder } from "./extensionItemRequestBuilder"
import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        extensionItem:ExtensionItemRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "extensionItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new ExtensionItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
