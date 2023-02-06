            export * from './mailFolderItemRequestBuilderGetQueryParameters'
            export * from './mailFolderItemRequestBuilderDeleteRequestConfiguration'
            export * from './mailFolderItemRequestBuilderGetRequestConfiguration'
            export * from './mailFolderItemRequestBuilderPatchRequestConfiguration'
            import {MailFolderItemRequestBuilder } from "./mailFolderItemRequestBuilder"
            import {UserItemRequestBuilder} from "../../userItemRequestBuilder"
            import { getPathParameters } from "@microsoft/kiota-abstractions";
            declare module "../../userItemRequestBuilder"{
                interface UserItemRequestBuilder{
                    mailFoldersById:(id : string) => MailFolderItemRequestBuilder
                }
            }
            Reflect.defineProperty(UserItemRequestBuilder.prototype, "mailFoldersById", {
                configurable: true,
                enumerable: true,
                get: function() {
                    return function(this: UserItemRequestBuilder, id: string){
                        const urlTplParams = getPathParameters(this.pathParameters);
                        urlTplParams["mailFolder%2Did"] = id
                        return new MailFolderItemRequestBuilder(urlTplParams,this.requestAdapter)
                    }
            }
        })
