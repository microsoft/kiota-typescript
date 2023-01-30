export * from './childFoldersRequestBuilderPostRequestConfiguration'
export * from './childFoldersRequestBuilderGetQueryParameters'
export * from './childFoldersRequestBuilderGetRequestConfiguration'
import {ChildFoldersRequestBuilder } from "./childFoldersRequestBuilder"
import {MailFolderItemRequestBuilder} from "./../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        childFolders:ChildFoldersRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "childFolders", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new ChildFoldersRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
