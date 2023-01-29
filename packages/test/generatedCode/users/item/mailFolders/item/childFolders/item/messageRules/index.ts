export * from './messageRulesRequestBuilderGetQueryParameters'
export * from './messageRulesRequestBuilderGetRequestConfiguration'
export * from './messageRulesRequestBuilderPostRequestConfiguration'
import {MessageRulesRequestBuilder } from "./messageRulesRequestBuilder"
import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
declare module "../MailFolderItemRequestBuilder"{
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
