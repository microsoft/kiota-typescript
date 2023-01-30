export * from './mailFolderItemRequestBuilderDeleteRequestConfiguration'
export * from './mailFolderItemRequestBuilderPatchRequestConfiguration'
export * from './mailFolderItemRequestBuilderGetRequestConfiguration'
export * from './mailFolderItemRequestBuilderGetQueryParameters'
import {MailFolderItemRequestBuilder } from "./mailFolderItemRequestBuilder"
import {UserItemRequestBuilder} from "../../userItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../userItemRequestBuilder"{
    interface UserItemRequestBuilder{
        mailFolderItem:MailFolderItemRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "mailFolderItem", {
    configurable: true,
    enumerable: true,
    get: function(this: UserItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MailFolderItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
