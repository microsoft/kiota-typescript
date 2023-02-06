            export * from './extensionItemRequestBuilderPatchRequestConfiguration'
            export * from './extensionItemRequestBuilderGetRequestConfiguration'
            export * from './extensionItemRequestBuilderDeleteRequestConfiguration'
            export * from './extensionItemRequestBuilderGetQueryParameters'
            import {ExtensionItemRequestBuilder } from "./extensionItemRequestBuilder"
            import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
            import { getPathParameters } from "@microsoft/kiota-abstractions";
            declare module "../../messageItemRequestBuilder"{
                interface MessageItemRequestBuilder{
                    extensionsById:(id : string) => ExtensionItemRequestBuilder
                }
            }
            Reflect.defineProperty(MessageItemRequestBuilder.prototype, "extensionsById", {
                configurable: true,
                enumerable: true,
                get: function() {
                    return function(this: MessageItemRequestBuilder, id: string){
                        const urlTplParams = getPathParameters(this.pathParameters);
                        urlTplParams["extension%2Did"] = id
                        return new ExtensionItemRequestBuilder(urlTplParams,this.requestAdapter)
                    }
            }
        })
