import type { KeysToExcludeForNavigationMetadata, NavigationMetadata, NextGenBaseRequestBuilder } from "@microsoft/kiota-abstractions";
import { MessagesProxyRequestBuilderUriTemplate, type MessagesProxyRequestBuilder, MessagesProxyRequestBuilderRequestsMetadata, MessagesProxyRequestBuilderNavigationMetadata } from "./messages/messagesProxyRequestBuilder";

export interface UserItemProxyRequestBuilder {
	get messages(): MessagesProxyRequestBuilder & NextGenBaseRequestBuilder<MessagesProxyRequestBuilder>;
}

export const UserItemProxyRequestBuilderUriTemplate = "{+baseurl}/users/{user%2Did}";
export const UserItemProxyRequestBuilderNavigationMetadata: Record<Exclude<keyof UserItemProxyRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
	"messages": {
		uriTemplate: MessagesProxyRequestBuilderUriTemplate,
		requestsMetadata: MessagesProxyRequestBuilderRequestsMetadata,
		navigationMetadata: MessagesProxyRequestBuilderNavigationMetadata,
	}
}