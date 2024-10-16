/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { getPathParameters } from "./getPathParameters";
import { HttpMethod } from "./httpMethod";
import type { ErrorMappings, PrimitiveTypesForDeserialization, PrimitiveTypesForDeserializationType, RequestAdapter, SendMethods } from "./requestAdapter";
import type { RequestConfiguration } from "./requestConfiguration";
import { RequestInformation, type RequestInformationSetContent } from "./requestInformation";
import type { ModelSerializerFunction, Parsable, ParsableFactory } from "./serialization";
const sanitizeMethodName = (methodName: string): string => {
	if (methodName.startsWith("to")) {
		return methodName.substring(2).replace("RequestInformation", "").toLowerCase();
	}
	return methodName;
};
const getRequestMethod = (key: string): KeysOfRequestsMetadata | undefined => {
	switch (sanitizeMethodName(key)) {
		case "delete":
			return "delete";
		case "get":
			return "get";
		case "head":
			return "head";
		case "options":
			return "options";
		case "patch":
			return "patch";
		case "post":
			return "post";
		case "put":
			return "put";
		default:
			return undefined;
	}
};

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const toRequestInformation = <QueryParametersType extends object>(urlTemplate: string, pathParameters: Record<string, unknown>, metadata: RequestMetadata, requestAdapter: RequestAdapter, httpMethod: HttpMethod, body: unknown | ArrayBuffer | undefined, bodyMediaType: string | undefined, requestConfiguration: RequestConfiguration<QueryParametersType> | undefined): RequestInformation => {
	const requestInfo = new RequestInformation(httpMethod, urlTemplate, pathParameters);
	requestInfo.configure(requestConfiguration, metadata.queryParametersMapper);
	addAcceptHeaderIfPresent(metadata, requestInfo);
	if (metadata.requestBodySerializer) {
		if (!body) throw new Error("body cannot be undefined");
		if (typeof metadata.requestBodySerializer === "function") {
			requestInfo.setContentFromParsable(requestAdapter, metadata.requestBodyContentType ? metadata.requestBodyContentType : bodyMediaType, body, metadata.requestBodySerializer);
		} else {
			requestInfo.setContentFromScalar(requestAdapter, metadata.requestBodyContentType ? metadata.requestBodyContentType : bodyMediaType, body as PrimitiveTypesForDeserializationType);
		}
	} else if (metadata.requestInformationContentSetMethod === "setStreamContent") {
		if (!body) throw new Error("body cannot be undefined");
		requestInfo.setStreamContent(body as ArrayBuffer, metadata.requestBodyContentType ? metadata.requestBodyContentType : bodyMediaType);
	}
	return requestInfo;
};
const addAcceptHeaderIfPresent = (metadata: RequestMetadata, requestInfo: RequestInformation): void => {
	if (metadata.responseBodyContentType) {
		requestInfo.headers.tryAdd("Accept", metadata.responseBodyContentType);
	}
};
const getRequestMediaTypeUserDefinedValue = (requestMetadata: RequestMetadata, args: unknown[]): string | undefined => {
	if (args.length > 2 && !requestMetadata.requestBodySerializer && requestMetadata.requestInformationContentSetMethod === "setStreamContent" && typeof args[1] === "string") {
		// request body with unknown media type so we have an argument for it.
		return args[1];
	}
	return undefined;
};
const getRequestConfigurationValue = (args: unknown[]): RequestConfiguration<object> | undefined => {
	if (args.length > 0) {
		// request configuration is always the last argument
		return args[args.length - 1] as RequestConfiguration<object>;
	}
	return undefined;
};
const send = (requestAdapter: RequestAdapter, requestInfo: RequestInformation, metadata: RequestMetadata) => {
	switch (metadata.adapterMethodName) {
		case "send":
			if (!metadata.responseBodyFactory) {
				throw new Error("couldn't find response body factory");
			}
			return requestAdapter.send(requestInfo, metadata.responseBodyFactory as ParsableFactory<Parsable>, metadata.errorMappings);
		case "sendCollection":
			if (!metadata.responseBodyFactory) {
				throw new Error("couldn't find response body factory");
			}
			return requestAdapter.sendCollection(requestInfo, metadata.responseBodyFactory as ParsableFactory<Parsable>, metadata.errorMappings);
		case "sendEnum":
			if (!metadata.enumObject) {
				throw new Error("couldn't find response body factory");
			}
			return requestAdapter.sendEnum(requestInfo, metadata.enumObject, metadata.errorMappings);
		case "sendCollectionOfEnum":
			if (!metadata.enumObject) {
				throw new Error("couldn't find response body factory");
			}
			return requestAdapter.sendCollectionOfEnum(requestInfo, metadata.enumObject, metadata.errorMappings);
		case "sendCollectionOfPrimitive":
			if (!metadata.responseBodyFactory) {
				throw new Error("couldn't find response body factory");
			}
			return requestAdapter.sendCollectionOfPrimitive(requestInfo, metadata.responseBodyFactory as Exclude<PrimitiveTypesForDeserialization, "ArrayBuffer">, metadata.errorMappings);
		case "sendPrimitive":
			if (!metadata.responseBodyFactory) {
				throw new Error("couldn't find response body factory");
			}
			return requestAdapter.sendPrimitive(requestInfo, metadata.responseBodyFactory as PrimitiveTypesForDeserialization, metadata.errorMappings);
		case "sendNoResponseContent":
			return requestAdapter.sendNoResponseContent(requestInfo, metadata.errorMappings);
		default:
			throw new Error("couldn't find adapter method");
	}
};
export const apiClientProxifier = <T extends object>(requestAdapter: RequestAdapter, pathParameters: Record<string, unknown>, navigationMetadata?: Record<string, NavigationMetadata>, requestsMetadata?: RequestsMetadata): T => {
	if (!requestAdapter) throw new Error("requestAdapter cannot be undefined");
	if (!pathParameters) throw new Error("pathParameters cannot be undefined");
	return new Proxy({} as T, {
		get: (_, property) => {
			const name = String(property);
			if (name === "withUrl") {
				return (rawUrl: string) => {
					if (!rawUrl) throw new Error("rawUrl cannot be undefined");
					return apiClientProxifier(requestAdapter, getPathParameters(rawUrl), navigationMetadata, requestsMetadata);
				};
			}
			if (requestsMetadata) {
				const metadataKey = getRequestMethod(name);
				if (metadataKey) {
					const metadata = requestsMetadata[metadataKey];
					if (metadata) {
						switch (name) {
							case "get":
								return (requestConfiguration?: RequestConfiguration<object>) => {
									const requestInfo = toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.GET, undefined, undefined, requestConfiguration);
									return send(requestAdapter, requestInfo, metadata);
								};
							case "patch":
								return (...args: unknown[]) => {
									const requestInfo = toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.PATCH, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
									return send(requestAdapter, requestInfo, metadata);
								};
							case "put":
								return (...args: unknown[]) => {
									const requestInfo = toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.PUT, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
									return send(requestAdapter, requestInfo, metadata);
								};
							case "delete":
								return (...args: unknown[]) => {
									const requestInfo = toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.DELETE, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
									return send(requestAdapter, requestInfo, metadata);
								};
							case "post":
								return (...args: unknown[]) => {
									const requestInfo = toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.POST, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
									return send(requestAdapter, requestInfo, metadata);
								};
							case "toGetRequestInformation":
								return (requestConfiguration?: RequestConfiguration<object>) => {
									return toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.GET, undefined, undefined, requestConfiguration);
								};
							case "toPatchRequestInformation":
								return (...args: unknown[]) => {
									return toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.PATCH, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
								};
							case "toPutRequestInformation":
								return (...args: unknown[]) => {
									return toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.PUT, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
								};
							case "toDeleteRequestInformation":
								return (...args: unknown[]) => {
									return toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.DELETE, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
								};
							case "toPostRequestInformation":
								return (...args: unknown[]) => {
									return toRequestInformation(metadata.uriTemplate, pathParameters, metadata, requestAdapter, HttpMethod.POST, args.length > 0 ? args[0] : undefined, getRequestMediaTypeUserDefinedValue(metadata, args), getRequestConfigurationValue(args));
								};
							default:
								break;
						}
					}
				}
			}
			if (navigationMetadata) {
				const navigationCandidate = navigationMetadata[name];
				if (navigationCandidate) {
					if (!navigationCandidate.pathParametersMappings || navigationCandidate.pathParametersMappings.length === 0) {
						// navigation property
						return apiClientProxifier<object>(requestAdapter, getPathParameters(pathParameters), navigationCandidate.navigationMetadata, navigationCandidate.requestsMetadata);
					}
					return (...argArray: unknown[]) => {
						// navigation method like indexers or multiple path parameters
						const downWardPathParameters = getPathParameters(pathParameters);
						if (navigationCandidate.pathParametersMappings && navigationCandidate.pathParametersMappings.length > 0) {
							for (let i = 0; i < argArray.length; i++) {
								const element = argArray[i];
								if (element === undefined || element === null || element === "") {
									throw new Error(`path parameter ${navigationCandidate.pathParametersMappings[i]} cannot be undefined`);
								} else {
									downWardPathParameters[navigationCandidate.pathParametersMappings[i]] = element;
								}
							}
						}
						return apiClientProxifier(requestAdapter, downWardPathParameters, navigationCandidate.navigationMetadata, navigationCandidate.requestsMetadata);
					};
				}
				throw new Error(`couldn't find navigation property ${name} data: ${JSON.stringify(navigationMetadata)}`);
			}
		},
	});
};

export interface RequestMetadata {
	requestBodyContentType?: string;
	responseBodyContentType?: string;
	errorMappings?: ErrorMappings;
	adapterMethodName?: SendMethods;
	responseBodyFactory?: ParsableFactory<Parsable> | PrimitiveTypesForDeserialization;
	requestBodySerializer?: ModelSerializerFunction<Parsable> | PrimitiveTypesForDeserialization;
	requestInformationContentSetMethod?: keyof RequestInformationSetContent;
	queryParametersMapper?: Record<string, string>;
	uriTemplate: string;
	enumObject?: EnumObject;
}
export interface RequestsMetadata {
	delete?: RequestMetadata;
	get?: RequestMetadata;
	head?: RequestMetadata;
	options?: RequestMetadata;
	patch?: RequestMetadata;
	post?: RequestMetadata;
	put?: RequestMetadata;
}

type KeysOfRequestsMetadata = keyof RequestsMetadata;

export interface NavigationMetadata {
	requestsMetadata?: RequestsMetadata;
	navigationMetadata?: Record<string, NavigationMetadata>;
	pathParametersMappings?: string[];
}

type EnumObject<T extends Record<string, unknown> = Record<string, unknown>> = T;

export type KeysToExcludeForNavigationMetadata = KeysOfRequestsMetadata | "toDeleteRequestInformation" | "toGetRequestInformation" | "toHeadRequestInformation" | "toOptionsRequestInformation" | "toPatchRequestInformation" | "toPostRequestInformation" | "toPutRequestInformation" | "withUrl";
