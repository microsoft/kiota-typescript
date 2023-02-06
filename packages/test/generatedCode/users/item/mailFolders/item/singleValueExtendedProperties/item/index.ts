                    export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration'
                    export * from './singleValueLegacyExtendedPropertyItemRequestBuilderGetQueryParameters'
                    export * from './singleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration'
                    export * from './singleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration'
                    import {SingleValueLegacyExtendedPropertyItemRequestBuilder } from "./singleValueLegacyExtendedPropertyItemRequestBuilder"
                    import {MailFolderItemRequestBuilder} from "../../mailFolderItemRequestBuilder"
                    import { getPathParameters } from "@microsoft/kiota-abstractions";
                    declare module "../../mailFolderItemRequestBuilder"{
                        interface MailFolderItemRequestBuilder{
                            singleValueExtendedPropertiesById:(id : string) => SingleValueLegacyExtendedPropertyItemRequestBuilder
                        }
                    }
                    Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "singleValueExtendedPropertiesById", {
                        configurable: true,
                        enumerable: true,
                        get: function() {
                            return function(this: MailFolderItemRequestBuilder, id: string){
                                const urlTplParams = getPathParameters(this.pathParameters);
                                urlTplParams["singleValueLegacyExtendedProperty%2Did"] = id
                                return new SingleValueLegacyExtendedPropertyItemRequestBuilder(urlTplParams,this.requestAdapter)
                            }
                    }
                })
