export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
import {MultiValueLegacyExtendedPropertyItemRequestBuilder } from "./multiValueLegacyExtendedPropertyItemRequestBuilder"
import {MultiValueExtendedPropertiesRequestBuilder} from "../multiValueExtendedPropertiesRequestBuilder"
declare module "../multiValueExtendedPropertiesRequestBuilder"{
    interface multiValueExtendedPropertiesRequestBuilder{
        multiValueLegacyExtendedPropertyItem:MultiValueLegacyExtendedPropertyItemRequestBuilder
    }
}
Reflect.defineProperty(MultiValueExtendedPropertiesRequestBuilder.prototype, "multiValueLegacyExtendedPropertyItem", {
    configurable: true,
    enumerable: true,
    get: function(this: MultiValueExtendedPropertiesRequestBuilder) {
        return new MultiValueLegacyExtendedPropertyItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
