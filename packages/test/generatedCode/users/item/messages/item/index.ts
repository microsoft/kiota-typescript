export * from './messageItemRequestBuilderPatchRequestConfiguration'
export * from './messageItemRequestBuilderDeleteRequestConfiguration'
export * from './messageItemRequestBuilderGetQueryParameters'
export * from './messageItemRequestBuilderGetRequestConfiguration'
import {MessageItemRequestBuilder } from "./messageItemRequestBuilder"
import {UserItemRequestBuilder} from "../../userItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../userItemRequestBuilder"{
    interface UserItemRequestBuilder{
        messageItem:(id:string) => MessageItemRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "messageItem", {
    configurable: true,
    enumerable: true,
    get: function() {
        return (function(this: UserItemRequestBuilder, id:String){
        const urlTplParams = getPathParameters(this.pathParameters);
        console.log("messageid ->", id);
        console.log(urlTplParams);
        urlTplParams["message%2Did"] = id
        return new MessageItemRequestBuilder(urlTplParams,this.requestAdapter)
        })
    } as any
})
