export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
import {SingleValueLegacyExtendedPropertyItemRequestBuilder } from "./singleValueLegacyExtendedPropertyItemRequestBuilder"
import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        singleValueLegacyExtendedPropertyItem:SingleValueLegacyExtendedPropertyItemRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "singleValueLegacyExtendedPropertyItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new SingleValueLegacyExtendedPropertyItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
