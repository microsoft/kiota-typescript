export * from './singleValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
export * from './singleValueExtendedPropertiesRequestBuilderGetQueryParameters'
export * from './singleValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
import {SingleValueExtendedPropertiesRequestBuilder } from "./singleValueExtendedPropertiesRequestBuilder"
import {MessageItemRequestBuilder} from "./../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        singleValueExtendedProperties:SingleValueExtendedPropertiesRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "singleValueExtendedProperties", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new SingleValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
