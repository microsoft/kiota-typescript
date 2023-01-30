export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
import {SingleValueLegacyExtendedPropertyItemRequestBuilder } from "./singleValueLegacyExtendedPropertyItemRequestBuilder"
import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        singleValueLegacyExtendedPropertyItem:SingleValueLegacyExtendedPropertyItemRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "singleValueLegacyExtendedPropertyItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new SingleValueLegacyExtendedPropertyItemRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
