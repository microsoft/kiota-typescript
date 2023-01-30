export * from './multiValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
export * from './multiValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './multiValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
import {MultiValueExtendedPropertiesRequestBuilder } from "./multiValueExtendedPropertiesRequestBuilder"
import {MailFolderItemRequestBuilder} from "./../mailFolderItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../mailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        multiValueExtendedProperties:MultiValueExtendedPropertiesRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "multiValueExtendedProperties", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MultiValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
