import type { NavigationMetadata, NextGenBaseRequestBuilder } from "@microsoft/kiota-abstractions";
import { MessagesProxyRequestBuilderUriTemplate, type MessagesProxyRequestBuilder, MessagesProxyRequestBuilderRequestsMetadata } from "./messages/messagesProxyRequestBuilder";

export interface UserItemProxyRequestBuilder {
	get messages(): MessagesProxyRequestBuilder & NextGenBaseRequestBuilder<MessagesProxyRequestBuilder>;
}

export const UserItemProxyRequestBuilderUriTemplate = "{+baseurl}/users/{user%2Did}";
export const UserItemProxyRequestBuilderNavigationMetadata: Record<keyof UserItemProxyRequestBuilder, NavigationMetadata> = {
	"messages": {
		uriTemplate: MessagesProxyRequestBuilderUriTemplate,
		requestsMetadata: MessagesProxyRequestBuilderRequestsMetadata,
	}
}