/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { type UsersRequestBuilder, UsersRequestBuilderNavigationMetadata } from './users/index.js';
// @ts-ignore
import { apiClientProxifier, registerDefaultDeserializer, registerDefaultSerializer, type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type RequestAdapter } from '@microsoft/kiota-abstractions';
// @ts-ignore
import { FormParseNodeFactory, FormSerializationWriterFactory } from '@microsoft/kiota-serialization-form';
// @ts-ignore
import { JsonParseNodeFactory, JsonSerializationWriterFactory } from '@microsoft/kiota-serialization-json';
// @ts-ignore
import { MultipartSerializationWriterFactory } from '@microsoft/kiota-serialization-multipart';
// @ts-ignore
import { TextParseNodeFactory, TextSerializationWriterFactory } from '@microsoft/kiota-serialization-text';
import {ParseNodeFactoryRegistry, SerializationWriterFactory} from "@microsoft/kiota-abstractions/src";

/**
 * The main entry point of the SDK, exposes the configuration and the fluent API.
 */
export interface ApiClient extends BaseRequestBuilder<ApiClient> {
    /**
     * The users property
     */
    get users(): UsersRequestBuilder;
}
/**
 * Instantiates a new {@link ApiClient} and sets the default values.
 * @param requestAdapter The request adapter to use to execute the requests.
 */
// @ts-ignore
export function createApiClient(requestAdapter: RequestAdapter) {
    registerDefaultSerializer(requestAdapter.getSerializationWriterFactory() as SerializationWriterFactory, JsonSerializationWriterFactory);
    registerDefaultSerializer(requestAdapter.getSerializationWriterFactory() as SerializationWriterFactory, TextSerializationWriterFactory);
    registerDefaultSerializer(requestAdapter.getSerializationWriterFactory() as SerializationWriterFactory, FormSerializationWriterFactory);
    registerDefaultSerializer(requestAdapter.getSerializationWriterFactory() as SerializationWriterFactory, MultipartSerializationWriterFactory);
    registerDefaultDeserializer(requestAdapter.getParseNodeFactory() as ParseNodeFactoryRegistry, JsonParseNodeFactory);
    registerDefaultDeserializer(requestAdapter.getParseNodeFactory() as ParseNodeFactoryRegistry, TextParseNodeFactory);
    registerDefaultDeserializer(requestAdapter.getParseNodeFactory() as ParseNodeFactoryRegistry, FormParseNodeFactory);
    if (requestAdapter.baseUrl === undefined || requestAdapter.baseUrl === "") {
        requestAdapter.baseUrl = "https://graph.microsoft.com/v1.0";
    }
    const pathParameters: Record<string, unknown> = {
        "baseurl": requestAdapter.baseUrl,
    };
    return apiClientProxifier<ApiClient>(requestAdapter, pathParameters, ApiClientNavigationMetadata, undefined);
}
/**
 * Uri template for the request builder.
 */
export const ApiClientUriTemplate = "{+baseurl}";
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const ApiClientNavigationMetadata: Record<Exclude<keyof ApiClient, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    users: {
        navigationMetadata: UsersRequestBuilderNavigationMetadata,
    },
};
/* tslint:enable */
/* eslint-enable */
