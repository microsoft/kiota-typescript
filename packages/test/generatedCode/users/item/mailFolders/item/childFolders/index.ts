export * from './childFoldersRequestBuilderPostRequestConfiguration'
export * from './childFoldersRequestBuilderGetQueryParameters'
export * from './childFoldersRequestBuilderGetRequestConfiguration'
import {ChildFoldersRequestBuilder } from "./childFoldersRequestBuilder"
import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
declare module "../MailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        childFolders:ChildFoldersRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "childFolders", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder) {
        return new ChildFoldersRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
