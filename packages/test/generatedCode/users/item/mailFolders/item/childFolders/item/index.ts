export * from './mailFolderItemRequestBuilderDeleteRequestConfiguration'
export * from './mailFolderItemRequestBuilderPatchRequestConfiguration'
export * from './mailFolderItemRequestBuilderGetRequestConfiguration'
export * from './mailFolderItemRequestBuilderGetQueryParameters'
import {MailFolderItemRequestBuilder as MailFolderItemRequestBuilderChild} from "./mailFolderItemRequestBuilder"
import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        mailFolderItem:MailFolderItemRequestBuilderChild
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "mailFolderItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MailFolderItemRequestBuilderChild(this.pathParameters,this.requestAdapter)
    } as any
})
