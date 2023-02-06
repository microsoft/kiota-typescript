        export * from './contentRequestBuilderGetRequestConfiguration'
        export * from './contentRequestBuilderPutRequestConfiguration'
        import {ContentRequestBuilder } from "./contentRequestBuilder"
        import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
        declare module "../messageItemRequestBuilder"{
            interface MessageItemRequestBuilder{
                content:ContentRequestBuilder
            }
        }
        Reflect.defineProperty(MessageItemRequestBuilder.prototype, "content", {
            configurable: true,
            enumerable: true,
            get: function(this: MessageItemRequestBuilder) {
                return new ContentRequestBuilder(this.pathParameters,this.requestAdapter)
                }
            })
