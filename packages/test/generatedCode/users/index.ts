import {UsersRequestBuilder } from "./usersRequestBuilder"
import {ApiClient} from "../apiClient"
declare module "../apiClient"{
    interface ApiClient{
        users:UsersRequestBuilder
    }
}
Reflect.defineProperty(ApiClient.prototype, "users", {
    configurable: true,
    enumerable: true,
    get: function(this: ApiClient) {
        return new UsersRequestBuilder(this.pathParameters,this.requestAdapter)
        }
    })
