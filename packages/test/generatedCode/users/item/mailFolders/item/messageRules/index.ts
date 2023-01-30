export * from './messageRulesRequestBuilderGetRequestConfiguration'
export * from './messageRulesRequestBuilderGetQueryParameters'
export * from './messageRulesRequestBuilderPostRequestConfiguration'
import {MessageRulesRequestBuilder } from "./messageRulesRequestBuilder"
import {MailFolderItemRequestBuilder} from "./../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        messageRules:MessageRulesRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "messageRules", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MessageRulesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
