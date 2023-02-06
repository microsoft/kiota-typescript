        export * from './mailFoldersRequestBuilderPostRequestConfiguration'
        export * from './mailFoldersRequestBuilderGetRequestConfiguration'
        export * from './mailFoldersRequestBuilderGetQueryParameters'
        import {MailFoldersRequestBuilder } from "./mailFoldersRequestBuilder"
        import {UserItemRequestBuilder} from "../userItemRequestBuilder"
        declare module "../userItemRequestBuilder"{
            interface UserItemRequestBuilder{
                mailFolders:MailFoldersRequestBuilder
            }
        }
        Reflect.defineProperty(UserItemRequestBuilder.prototype, "mailFolders", {
            configurable: true,
            enumerable: true,
            get: function(this: UserItemRequestBuilder) {
                return new MailFoldersRequestBuilder(this.pathParameters,this.requestAdapter)
                }
            })
