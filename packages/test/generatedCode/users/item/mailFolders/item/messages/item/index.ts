            export * from './messageItemRequestBuilderDeleteRequestConfiguration'
            export * from './messageItemRequestBuilderPatchRequestConfiguration'
            export * from './messageItemRequestBuilderGetQueryParameters'
            export * from './messageItemRequestBuilderGetRequestConfiguration'
            import {MessageItemRequestBuilder } from "./messageItemRequestBuilder"
            import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
            import { getPathParameters } from "@microsoft/kiota-abstractions";
            declare module "../../mailFolderItemRequestBuilder"{
                interface MailFolderItemRequestBuilder{
                    messagesById:(id : string) => MessageItemRequestBuilder
                }
            }
            Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messagesById", {
                configurable: true,
                enumerable: true,
                get: function() {
                    return function(this: MailFolderItemRequestBuilder, id: string){
                        const urlTplParams = getPathParameters(this.pathParameters);
                        urlTplParams["message%2Did"] = id
                        return new MessageItemRequestBuilder(urlTplParams,this.requestAdapter)
                    }
            }
        })
