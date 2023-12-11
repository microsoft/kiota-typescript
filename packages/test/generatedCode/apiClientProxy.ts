import type { NextGenBaseRequestBuilder, RequestAdapter } from "@microsoft/kiota-abstractions";
import { registerDefaultSerializer, type NavigationMetadata, registerDefaultDeserializer } from "@microsoft/kiota-abstractions";
import { UsersProxyRequestBuilderUriTemplate, type UsersProxyRequestBuilder, UsersProxyRequestBuilderNavigationMetadata } from "./users/usersProxyRequestBuilder";
import { JsonParseNodeFactory, JsonSerializationWriterFactory } from "@microsoft/kiota-serialization-json";
import { TextParseNodeFactory, TextSerializationWriterFactory } from "@microsoft/kiota-serialization-text";
import { FormParseNodeFactory, FormSerializationWriterFactory } from "@microsoft/kiota-serialization-form";
import { MultipartSerializationWriterFactory } from "@microsoft/kiota-serialization-multipart";
import { apiClientProxifier } from "@microsoft/kiota-abstractions";

export interface ApiClientProxy {
	/**
     * The users property
     */
    get users(): UsersProxyRequestBuilder & NextGenBaseRequestBuilder<UsersProxyRequestBuilder>;
}
export const ApiClientProxyUriTemplate = "{+baseurl}";
export const ApiClientProxyNavigationMetadata: Record<keyof ApiClientProxy, NavigationMetadata> = {
	"users": {
		uriTemplate: UsersProxyRequestBuilderUriTemplate,
		navigationMetadata: UsersProxyRequestBuilderNavigationMetadata,
	}
}

export function getNewApiClient(requestAdapter: RequestAdapter) {
	// this could effectively be a constructor in a class
	registerDefaultSerializer(JsonSerializationWriterFactory);
	registerDefaultSerializer(TextSerializationWriterFactory);
	registerDefaultSerializer(FormSerializationWriterFactory);
	registerDefaultSerializer(MultipartSerializationWriterFactory);
	registerDefaultDeserializer(JsonParseNodeFactory);
	registerDefaultDeserializer(TextParseNodeFactory);
	registerDefaultDeserializer(FormParseNodeFactory);
	if (requestAdapter.baseUrl === undefined || requestAdapter.baseUrl === "") {
		requestAdapter.baseUrl = "https://graph.microsoft.com/v1.0";
	}
	const pathParameters: Record<string, unknown> = {
		"baseurl": requestAdapter.baseUrl,
	};
	return apiClientProxifier<ApiClientProxy>(requestAdapter, pathParameters, ApiClientProxyUriTemplate, ApiClientProxyNavigationMetadata) as ApiClientProxy & NextGenBaseRequestBuilder<ApiClientProxy>;
}