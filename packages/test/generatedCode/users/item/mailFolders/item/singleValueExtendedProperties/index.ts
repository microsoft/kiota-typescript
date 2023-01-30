export * from './singleValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
export * from './singleValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './singleValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
import {SingleValueExtendedPropertiesRequestBuilder } from "./singleValueExtendedPropertiesRequestBuilder"
import {MailFolderItemRequestBuilder} from "./../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        singleValueExtendedProperties:SingleValueExtendedPropertiesRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "singleValueExtendedProperties", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new SingleValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
