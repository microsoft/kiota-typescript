                export * from './mailFolderItemRequestBuilderGetQueryParameters'
                export * from './mailFolderItemRequestBuilderDeleteRequestConfiguration'
                export * from './mailFolderItemRequestBuilderGetRequestConfiguration'
                export * from './mailFolderItemRequestBuilderPatchRequestConfiguration'
                import {MailFolderItemRequestBuilder  as AliasedMailFolderItemRequestBuilder} from "./mailFolderItemRequestBuilder"
                import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
                import { getPathParameters } from "@microsoft/kiota-abstractions";
                declare module "../../mailFolderItemRequestBuilder"{
                    interface MailFolderItemRequestBuilder{
                        childFoldersById:(id : string) => AliasedMailFolderItemRequestBuilder
                    }
                }
                Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "childFoldersById", {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        return function(this: MailFolderItemRequestBuilder, id: string){
                            const urlTplParams = getPathParameters(this.pathParameters);
                            urlTplParams["mailFolder%2Did1"] = id
                            return new AliasedMailFolderItemRequestBuilder(urlTplParams,this.requestAdapter)
                        }
                }
            })
