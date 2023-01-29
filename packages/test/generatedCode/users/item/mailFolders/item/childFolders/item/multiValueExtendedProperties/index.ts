export * from './multiValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './multiValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
export * from './multiValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
import {MultiValueExtendedPropertiesRequestBuilder } from "./multiValueExtendedPropertiesRequestBuilder"
import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
declare module "../MailFolderItemRequestBuilder"{
    interface MailFolderItemRequestBuilder{
        multiValueExtendedProperties:MultiValueExtendedPropertiesRequestBuilder
    }
}
Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "multiValueExtendedProperties", {
    configurable: true,
    enumerable: true,
    get: function(this: MailFolderItemRequestBuilder) {
        return new MultiValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
