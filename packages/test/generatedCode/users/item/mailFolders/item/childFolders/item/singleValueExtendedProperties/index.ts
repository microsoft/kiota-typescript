export * from './singleValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './singleValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
export * from './singleValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
import {SingleValueExtendedPropertiesRequestBuilder } from "./singleValueExtendedPropertiesRequestBuilder"
import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
declare module "../MailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        singleValueExtendedProperties:SingleValueExtendedPropertiesRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "singleValueExtendedProperties", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder) {
        return new SingleValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
