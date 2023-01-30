import {UsersRequestBuilder } from "./usersRequestBuilder"
import {ApiClient} from "./../apiClient"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "./../apiClient"{
    interface ApiClient{
        users:UsersRequestBuilder
    }
}
Reflect.defineProperty(ApiClient.prototype, "users", {
    configurable: true,
    enumerable: true,
    get: function(this: ApiClient, id:String) {
        const urlTplParams = getPathParameters(this.pathParameters);
 urlTplParams["attachment%2Did"] = id
        return new UsersRequestBuilder(this.pathParameters,this.requestAdapter)
    } as any
})
