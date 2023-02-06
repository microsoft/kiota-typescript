        export * from './attachmentItemRequestBuilderGetRequestConfiguration'
        export * from './attachmentItemRequestBuilderDeleteRequestConfiguration'
        export * from './attachmentItemRequestBuilderGetQueryParameters'
        import {AttachmentItemRequestBuilder } from "./attachmentItemRequestBuilder"
        import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
        import { getPathParameters } from "@microsoft/kiota-abstractions";
        declare module "../../messageItemRequestBuilder"{
            interface MessageItemRequestBuilder{
                attachmentsById:(id : string) => AttachmentItemRequestBuilder
            }
        }
        Reflect.defineProperty(MessageItemRequestBuilder.prototype, "attachmentsById", {
            configurable: true,
            enumerable: true,
            get: function() {
                return function(this: MessageItemRequestBuilder, id: string){
                    const urlTplParams = getPathParameters(this.pathParameters);
                    urlTplParams["attachment%2Did"] = id
                    return new AttachmentItemRequestBuilder(urlTplParams,this.requestAdapter)
                }
        }
    })
