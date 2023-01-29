export * from './mailFolderItemRequestBuilderGetRequestConfiguration'
export * from './mailFolderItemRequestBuilderPatchRequestConfiguration'
export * from './mailFolderItemRequestBuilderGetQueryParameters'
export * from './mailFolderItemRequestBuilderDeleteRequestConfiguration'
import {MailFolderItemRequestBuilder } from "./mailFolderItemRequestBuilder"
import {ChildFoldersRequestBuilder} from "../childFoldersRequestBuilder"
declare module "../childFoldersRequestBuilder"{
    interface childFoldersRequestBuilder{
        mailFolderItem:MailFolderItemRequestBuilder
    }
}
Reflect.defineProperty(ChildFoldersRequestBuilder.prototype, "mailFolderItem", {
    configurable: true,
    enumerable: true,
    get: function(this: ChildFoldersRequestBuilder) {
        return new MailFolderItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
