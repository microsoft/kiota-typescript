export * from './mailFolderItemRequestBuilderGetRequestConfiguration'
export * from './mailFolderItemRequestBuilderPatchRequestConfiguration'
export * from './mailFolderItemRequestBuilderGetQueryParameters'
export * from './mailFolderItemRequestBuilderDeleteRequestConfiguration'
import {MailFolderItemRequestBuilder } from "./mailFolderItemRequestBuilder"
import {MailFoldersRequestBuilder} from "../mailFoldersRequestBuilder"
declare module "../mailFoldersRequestBuilder"{
    interface mailFoldersRequestBuilder{
        mailFolderItem:MailFolderItemRequestBuilder
    }
}
Reflect.defineProperty(MailFoldersRequestBuilder.prototype, "mailFolderItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFoldersRequestBuilder) {
        return new MailFolderItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
