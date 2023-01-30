export * from './contentRequestBuilderGetRequestConfiguration'
export * from './contentRequestBuilderPutRequestConfiguration'
import {ContentRequestBuilder } from "./contentRequestBuilder"
import {MessageItemRequestBuilder} from "./../messageItemRequestBuilder"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../messageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        content:ContentRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "content", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new ContentRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
