export * from './messageItemRequestBuilderPatchRequestConfiguration'
export * from './messageItemRequestBuilderDeleteRequestConfiguration'
export * from './messageItemRequestBuilderGetQueryParameters'
export * from './messageItemRequestBuilderGetRequestConfiguration'
import {MessageItemRequestBuilder } from "./messageItemRequestBuilder"
import {UserItemRequestBuilder} from "../../userItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../userItemRequestBuilder"{
    interface UserItemRequestBuilder{
        messageItem:MessageItemRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "messageItem", {
    configurable: true,
    enumerable: true,
    get: function(this: UserItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MessageItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
