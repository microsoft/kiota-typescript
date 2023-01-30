export * from './extensionsRequestBuilderGetQueryParameters'
export * from './extensionsRequestBuilderGetRequestConfiguration'
export * from './extensionsRequestBuilderPostRequestConfiguration'
import {ExtensionsRequestBuilder } from "./extensionsRequestBuilder"
import {MessageItemRequestBuilder} from "./../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        extensions:ExtensionsRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "extensions", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new ExtensionsRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
