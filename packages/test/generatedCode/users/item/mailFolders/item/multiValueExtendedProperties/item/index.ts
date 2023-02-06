                    export * from './multiValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
                    export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
                    export * from './multiValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
                    export * from './multiValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
                    import {MultiValueLegacyExtendedPropertyItemRequestBuilder } from "./multiValueLegacyExtendedPropertyItemRequestBuilder"
                    import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
                    import { getPathParameters } from "@microsoft/kiota-abstractions";
                    declare module "../../mailFolderItemRequestBuilder"{
                        interface MailFolderItemRequestBuilder{
                            multiValueExtendedPropertiesById:(id : string) => MultiValueLegacyExtendedPropertyItemRequestBuilder
                        }
                    }
                    Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "multiValueExtendedPropertiesById", {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                            return function(this: MailFolderItemRequestBuilder, id: string){
                                const urlTplParams = getPathParameters(this.pathParameters);
                                urlTplParams["multiValueLegacyExtendedProperty%2Did"] = id
                                return new MultiValueLegacyExtendedPropertyItemRequestBuilder(urlTplParams,this.requestAdapter)
                            }
                    }
                })
