export * from './messageRuleItemRequestBuilderGetRequestConfiguration'
export * from './messageRuleItemRequestBuilderDeleteRequestConfiguration'
export * from './messageRuleItemRequestBuilderGetQueryParameters'
export * from './messageRuleItemRequestBuilderPatchRequestConfiguration'
import {MessageRuleItemRequestBuilder } from "./messageRuleItemRequestBuilder"
import {MessageRulesRequestBuilder} from "../messageRulesRequestBuilder"
declare module "../messageRulesRequestBuilder"{
    interface messageRulesRequestBuilder{
        messageRuleItem:MessageRuleItemRequestBuilder
    }
}
Reflect.defineProperty(MessageRulesRequestBuilder.prototype, "messageRuleItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageRulesRequestBuilder) {
        return new MessageRuleItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
