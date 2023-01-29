import {UserItemRequestBuilder } from "./userItemRequestBuilder"
import {UsersRequestBuilder} from "../usersRequestBuilder"
declare module "../usersRequestBuilder"{
    interface usersRequestBuilder{
        userItem:UserItemRequestBuilder
    }
}
Reflect.defineProperty(UsersRequestBuilder.prototype, "userItem", {
    configurable: true,
    enumerable: true,
    get: function(this: UsersRequestBuilder) {
        return new UserItemRequestBuilder(this.pathParameters,this.requestAdapter)
    }
})
