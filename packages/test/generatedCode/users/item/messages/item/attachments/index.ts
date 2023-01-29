export * from './attachmentsRequestBuilderGetRequestConfiguration'
export * from './attachmentsRequestBuilderGetQueryParameters'
export * from './attachmentsRequestBuilderPostRequestConfiguration'
import {AttachmentsRequestBuilder } from "./attachmentsRequestBuilder"
import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
declare module "../MessageItemRequestBuilder"{
    interface MessageItemRequestBuilder{
        attachments:AttachmentsRequestBuilder
    }
}
Reflect.defineProperty(MessageItemRequestBuilder.prototype, "attachments", {
    configurable: true,
    enumerable: true,
    get: function(this: MessageItemRequestBuilder) {
        return new AttachmentsRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
