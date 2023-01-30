export * from './mailFoldersRequestBuilderGetQueryParameters'
export * from './mailFoldersRequestBuilderPostRequestConfiguration'
export * from './mailFoldersRequestBuilderGetRequestConfiguration'
import {MailFoldersRequestBuilder } from "./mailFoldersRequestBuilder"
import {UserItemRequestBuilder} from "./../userItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../userItemRequestBuilder"{
    interface UserItemRequestBuilder{
        mailFolders:MailFoldersRequestBuilder
    }
}
Reflect.defineProperty(UserItemRequestBuilder.prototype, "mailFolders", {
    configurable: true,
    enumerable: true,
    get: function(this: UserItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MailFoldersRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
