                export * from './singleValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
                export * from './singleValueExtendedPropertiesRequestBuilderGetQueryParameters'
                export * from './singleValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
                import {SingleValueExtendedPropertiesRequestBuilder } from "./singleValueExtendedPropertiesRequestBuilder"
                import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
                declare module "../mailFolderItemRequestBuilder"{
                    interface MailFolderItemRequestBuilder{
                        singleValueExtendedProperties:SingleValueExtendedPropertiesRequestBuilder
                    }
                }
                Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "singleValueExtendedProperties", {
                    configurable: true,
                    enumerable: true,
                    get: function(this: MailFolderItemRequestBuilder) {
                        return new SingleValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
                        }
                    })
