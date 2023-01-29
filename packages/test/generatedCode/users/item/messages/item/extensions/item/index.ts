export * from './extensionItemRequestBuilderDeleteRequestConfiguration'
export * from './extensionItemRequestBuilderGetRequestConfiguration'
export * from './extensionItemRequestBuilderPatchRequestConfiguration'
export * from './extensionItemRequestBuilderGetQueryParameters'
import {ExtensionItemRequestBuilder } from "./extensionItemRequestBuilder"
import {ExtensionsRequestBuilder} from "../extensionsRequestBuilder"
declare module "../extensionsRequestBuilder"{
    interface extensionsRequestBuilder{
        extensionItem:ExtensionItemRequestBuilder
    }
}
Reflect.defineProperty(ExtensionsRequestBuilder.prototype, "extensionItem", {
    configurable: true,
    enumerable: true,
    get: function(this: ExtensionsRequestBuilder) {
        return new ExtensionItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
