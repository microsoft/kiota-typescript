export * from './messageRuleItemRequestBuilderPatchRequestConfiguration'
export * from './messageRuleItemRequestBuilderDeleteRequestConfiguration'
export * from './messageRuleItemRequestBuilderGetRequestConfiguration'
export * from './messageRuleItemRequestBuilderGetQueryParameters'
import {MessageRuleItemRequestBuilder } from "./messageRuleItemRequestBuilder"
import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        messageRuleItem:MessageRuleItemRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messageRuleItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MessageRuleItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
