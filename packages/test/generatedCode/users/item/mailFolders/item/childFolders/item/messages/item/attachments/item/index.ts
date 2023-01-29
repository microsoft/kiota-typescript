export * from './attachmentItemRequestBuilderGetRequestConfiguration'
export * from './attachmentItemRequestBuilderGetQueryParameters'
export * from './attachmentItemRequestBuilderDeleteRequestConfiguration'
import {AttachmentItemRequestBuilder } from "./attachmentItemRequestBuilder"
import {AttachmentsRequestBuilder} from "../attachmentsRequestBuilder"
declare module "../attachmentsRequestBuilder"{
    interface attachmentsRequestBuilder{
        attachmentItem:AttachmentItemRequestBuilder
    }
}
Reflect.defineProperty(AttachmentsRequestBuilder.prototype, "attachmentItem", {
    configurable: true,
    enumerable: true,
    get: function(this: AttachmentsRequestBuilder) {
        return new AttachmentItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
