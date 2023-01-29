export * from './singleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
export * from './singleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
import {SingleValueLegacyExtendedPropertyItemRequestBuilder } from "./singleValueLegacyExtendedPropertyItemRequestBuilder"
import {SingleValueExtendedPropertiesRequestBuilder} from "../singleValueExtendedPropertiesRequestBuilder"
declare module "../singleValueExtendedPropertiesRequestBuilder"{
    interface singleValueExtendedPropertiesRequestBuilder{
        singleValueLegacyExtendedPropertyItem:SingleValueLegacyExtendedPropertyItemRequestBuilder
    }
}
Reflect.defineProperty(SingleValueExtendedPropertiesRequestBuilder.prototype, "singleValueLegacyExtendedPropertyItem", {
    configurable: true,
    enumerable: true,
    get: function(this: SingleValueExtendedPropertiesRequestBuilder) {
        return new SingleValueLegacyExtendedPropertyItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
