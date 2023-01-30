export * from './multiValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
import {MultiValueLegacyExtendedPropertyItemRequestBuilder } from "./multiValueLegacyExtendedPropertyItemRequestBuilder"
import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        multiValueLegacyExtendedPropertyItem:MultiValueLegacyExtendedPropertyItemRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "multiValueLegacyExtendedPropertyItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MultiValueLegacyExtendedPropertyItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
