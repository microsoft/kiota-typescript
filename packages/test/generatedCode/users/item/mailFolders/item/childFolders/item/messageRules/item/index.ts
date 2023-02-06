                export * from './messageRuleItemRequestBuilderGetRequestConfiguration'
                export * from './messageRuleItemRequestBuilderDeleteRequestConfiguration'
                export * from './messageRuleItemRequestBuilderPatchRequestConfiguration'
                export * from './messageRuleItemRequestBuilderGetQueryParameters'
                import {MessageRuleItemRequestBuilder } from "./messageRuleItemRequestBuilder"
                import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
                import { getPathParameters } from "@microsoft/kiota-abstractions";
                declare module "../../mailFolderItemRequestBuilder"{
                    interface MailFolderItemRequestBuilder{
                        messageRulesById:(id : string) => MessageRuleItemRequestBuilder
                    }
                }
                Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messageRulesById", {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        return function(this: MailFolderItemRequestBuilder, id: string){
                            const urlTplParams = getPathParameters(this.pathParameters);
                            urlTplParams["messageRule%2Did"] = id
                            return new MessageRuleItemRequestBuilder(urlTplParams,this.requestAdapter)
                        }
                }
            })
