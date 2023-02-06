            export * from './messageRulesRequestBuilderPostRequestConfiguration'
            export * from './messageRulesRequestBuilderGetRequestConfiguration'
            export * from './messageRulesRequestBuilderGetQueryParameters'
            import {MessageRulesRequestBuilder } from "./messageRulesRequestBuilder"
            import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
            declare module "../mailFolderItemRequestBuilder"{
                interface MailFolderItemRequestBuilder{
                    messageRules:MessageRulesRequestBuilder
                }
            }
            Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messageRules", {
                configurable: true,
                enumerable: true,
                get: function(this: MailFolderItemRequestBuilder) {
                    return new MessageRulesRequestBuilder(this.pathParameters,this.requestAdapter)
                    }
                })
