        export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
        export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
        export * from './singleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
        export * from './singleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
        import {SingleValueLegacyExtendedPropertyItemRequestBuilder } from "./singleValueLegacyExtendedPropertyItemRequestBuilder"
        import {MessageItemRequestBuilder} from "../../messageItemRequestBuilder"
        import { getPathParameters } from "@microsoft/kiota-abstractions";
        declare module "../../messageItemRequestBuilder"{
            interface MessageItemRequestBuilder{
                singleValueExtendedPropertiesById:(id : string) => SingleValueLegacyExtendedPropertyItemRequestBuilder
            }
        }
        Reflect.defineProperty(MessageItemRequestBuilder.prototype, "singleValueExtendedPropertiesById", {
            configurable: true,
            enumerable: true,
            get: function() {
                return function(this: MessageItemRequestBuilder, id: string){
                    const urlTplParams = getPathParameters(this.pathParameters);
                    urlTplParams["singleValueLegacyExtendedProperty%2Did"] = id
                    return new SingleValueLegacyExtendedPropertyItemRequestBuilder(urlTplParams,this.requestAdapter)
                }
        }
    })
