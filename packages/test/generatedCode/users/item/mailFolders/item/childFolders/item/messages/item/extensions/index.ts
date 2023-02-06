            export * from './extensionsRequestBuilderGetQueryParameters'
            export * from './extensionsRequestBuilderGetRequestConfiguration'
            export * from './extensionsRequestBuilderPostRequestConfiguration'
            import {ExtensionsRequestBuilder } from "./extensionsRequestBuilder"
            import {MessageItemRequestBuilder} from "../messageItemRequestBuilder"
            declare module "../messageItemRequestBuilder"{
                interface MessageItemRequestBuilder{
                    extensions:ExtensionsRequestBuilder
                }
            }
            Reflect.defineProperty(MessageItemRequestBuilder.prototype, "extensions", {
                configurable: true,
                enumerable: true,
                get: function(this: MessageItemRequestBuilder) {
                    return new ExtensionsRequestBuilder(this.pathParameters,this.requestAdapter)
                    }
                })
