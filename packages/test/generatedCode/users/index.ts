import {UsersRequestBuilder } from "./usersRequestBuilder"
import {ApiClient} from "../apiClient"
declare module "../ApiClient"{
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
