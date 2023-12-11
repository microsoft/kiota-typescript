import type { NavigationMetadata, NextGenBaseRequestBuilder, KeysToExcludeForNavigationMetadata } from "@microsoft/kiota-abstractions";
import { UserItemProxyRequestBuilderNavigationMetadata, type UserItemProxyRequestBuilder } from "./item/userItemProxyRequestBuilder";

export interface UsersProxyRequestBuilder {
	/**
     * Gets an item from the ApiSdk.users.item collection
     * @param userId Unique identifier of the item
     * @returns a UserItemRequestBuilder
     */
    byUserId(userId: string): UserItemProxyRequestBuilder & NextGenBaseRequestBuilder<UserItemProxyRequestBuilder>;
}

export const UsersProxyRequestBuilderUriTemplate = "{+baseurl}/users";
export const UsersProxyRequestBuilderNavigationMetadata: Record<Exclude<keyof UsersProxyRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
	"byUserId": {
		uriTemplate: UsersProxyRequestBuilderUriTemplate,
		navigationMetadata: UserItemProxyRequestBuilderNavigationMetadata,
		pathParametersMappings: ["user%2Did"]
	}
}