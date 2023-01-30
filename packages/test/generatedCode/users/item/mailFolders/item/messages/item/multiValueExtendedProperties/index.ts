export * from './multiValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
export * from './multiValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './multiValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
import {MultiValueExtendedPropertiesRequestBuilder } from "./multiValueExtendedPropertiesRequestBuilder"
import {MessageItemRequestBuilder} from "./../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        multiValueExtendedProperties:MultiValueExtendedPropertiesRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "multiValueExtendedProperties", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new MultiValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
