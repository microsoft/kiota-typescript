import {UserItemRequestBuilder } from "./userItemRequestBuilder"
import {ApiClient} from "../../apiClient"
import { getPathParameters } from "@microsoft/kiota-abstractions";
declare module "../../apiClient"{
    interface ApiClient{
        userItem:(id:string) =>UserItemRequestBuilder
    }
}
const s = function (this: ApiClient, id:String) {
    const urlTplParams = getPathParameters(this.pathParameters);
urlTplParams["attachment%2Did"] = id
    return new UserItemRequestBuilder(this.pathParameters,this.requestAdapter)
}
var c = Reflect.defineProperty(ApiClient.prototype, "userItem", {
    configurable: true,
    enumerable: true,
    get: function(){return s}
})


console.log("value of reflect.defineproperty");
console.log(ApiClient.prototype);
console.log(c);
console.log("value of reflect.defineproperty");
