        export * from './multiValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
        export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
        export * from './multiValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
        export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
        import {MultiValueLegacyExtendedPropertyItemRequestBuilder } from "./multiValueLegacyExtendedPropertyItemRequestBuilder"
        import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
        import { getPathParameters } from "@microsoft/kiota-abstractions";
        declare module "../../messageItemRequestBuilder"{
            interface MessageItemRequestBuilder{
                multiValueExtendedPropertiesById:(id : string) => MultiValueLegacyExtendedPropertyItemRequestBuilder
            }
        }
        Reflect.defineProperty(MessageItemRequestBuilder.prototype, "multiValueExtendedPropertiesById", {
            configurable: true,
            enumerable: true,
            get: function() {
                return function(this: MessageItemRequestBuilder, id: string){
                    const urlTplParams = getPathParameters(this.pathParameters);
                    urlTplParams["multiValueLegacyExtendedProperty%2Did"] = id
                    return new MultiValueLegacyExtendedPropertyItemRequestBuilder(urlTplParams,this.requestAdapter)
                }
        }
    })
