    export * from './messageItemRequestBuilderGetRequestConfiguration'
    export * from './messageItemRequestBuilderDeleteRequestConfiguration'
    export * from './messageItemRequestBuilderGetQueryParameters'
    export * from './messageItemRequestBuilderPatchRequestConfiguration'
    import {MessageItemRequestBuilder } from "./messageItemRequestBuilder"
    import {UserItemRequestBuilder} from "../../userItemRequestBuilder"
    import { getPathParameters } from "@microsoft/kiota-abstractions";
    declare module "../../userItemRequestBuilder"{
        interface UserItemRequestBuilder{
            messagesById:(id : string) => MessageItemRequestBuilder
        }
    }
    Reflect.defineProperty(UserItemRequestBuilder.prototype, "messagesById", {
        configurable: true,
        enumerable: true,
        get: function() {
            return function(this: UserItemRequestBuilder, id: string){
                const urlTplParams = getPathParameters(this.pathParameters);
                urlTplParams["message%2Did"] = id
                return new MessageItemRequestBuilder(urlTplParams,this.requestAdapter)
            }
    }
})
