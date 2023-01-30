export * from './multiValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
import {MultiValueLegacyExtendedPropertyItemRequestBuilder } from "./multiValueLegacyExtendedPropertyItemRequestBuilder"
import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        multiValueLegacyExtendedPropertyItem:MultiValueLegacyExtendedPropertyItemRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "multiValueLegacyExtendedPropertyItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MultiValueLegacyExtendedPropertyItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
