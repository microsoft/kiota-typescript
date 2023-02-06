    import {UserItemRequestBuilder } from "./userItemRequestBuilder"
    import {ApiClient} from "../../apiClient"
    import { getPathParameters } from "@microsoft/kiota-abstractions";
    declare module "../../apiClient"{
        interface ApiClient{
            usersById:(id : string) => UserItemRequestBuilder
        }
    }
    Reflect.defineProperty(ApiClient.prototype, "usersById", {
        configurable: true,
        enumerable: true,
        get: function() {
            return function(this: ApiClient, id: string){
                const urlTplParams = getPathParameters(this.pathParameters);
                urlTplParams["user%2Did"] = id
                return new UserItemRequestBuilder(urlTplParams,this.requestAdapter)
            }
    }
})
