            export * from './multiValueExtendedPropertiesRequestBuilderPostRequestConfiguration'
            export * from './multiValueExtendedPropertiesRequestBuilderGetRequestConfiguration'
            export * from './multiValueExtendedPropertiesRequestBuilderGetQueryParameters'
            import {MultiValueExtendedPropertiesRequestBuilder } from "./multiValueExtendedPropertiesRequestBuilder"
            import {MailFolderItemRequestBuilder} from "../mailFolderItemRequestBuilder"
            declare module "../mailFolderItemRequestBuilder"{
                interface MailFolderItemRequestBuilder{
                    multiValueExtendedProperties:MultiValueExtendedPropertiesRequestBuilder
                }
            }
            Reflect.defineProperty(MailFolderItemRequestBuilder.prototype, "multiValueExtendedProperties", {
                configurable: true,
                enumerable: true,
                get: function(this: MailFolderItemRequestBuilder) {
                    return new MultiValueExtendedPropertiesRequestBuilder(this.pathParameters,this.requestAdapter)
                    }
                })
