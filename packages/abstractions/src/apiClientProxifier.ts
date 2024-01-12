import { getPathParameters } from "./getPathParameters";
import { HttpMethod } from "./httpMethod";
import type {
  ErrorMappings,
  PrimitiveTypesForDeserialization,
  PrimitiveTypesForDeserializationType,
  RequestAdapter,
} from "./requestAdapter";
import type { RequestConfiguration } from "./requestConfiguration";
import {
  RequestInformation,
  type RequestInformationSetContent,
} from "./requestInformation";
import type {
  ModelSerializerFunction,
  Parsable,
  ParsableFactory,
} from "./serialization";
function sanitizeMethodName(methodName: string): string {
  if (methodName.startsWith("to")) {
    return methodName
      .substring(2)
      .replace("RequestInformation", "")
      .toLowerCase();
  }
  return methodName;
}
function getRequestMethod(key: string): KeysOfRequestsMetadata {
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
      throw new Error(`couldn't find request method for ${key}`);
  }
}

function toRequestInformation<QueryParametersType extends object>(
  urlTemplate: string,
  pathParameters: Record<string, unknown>,
  metadata: RequestMetadata,
  requestAdapter: RequestAdapter,
  httpMethod: HttpMethod,
  body: unknown | ArrayBuffer | undefined,
  bodyMediaType: string | undefined,
  requestConfiguration: RequestConfiguration<QueryParametersType> | undefined,
): RequestInformation {
  const requestInfo = new RequestInformation(
    httpMethod,
    urlTemplate,
    pathParameters,
  );
  requestInfo.configure(requestConfiguration, metadata.queryParametersMapper);
  addAcceptHeaderIfPresent(metadata, requestInfo);
  if (metadata.requestBodySerializer) {
    if (!body) throw new Error("body cannot be undefined");
    if (typeof metadata.requestBodySerializer === "function") {
      requestInfo.setContentFromParsable(
        requestAdapter,
        metadata.requestBodyContentType
          ? metadata.requestBodyContentType
          : bodyMediaType,
        body,
        metadata.requestBodySerializer,
      );
    } else {
      requestInfo.setContentFromScalar(
        requestAdapter,
        metadata.requestBodyContentType
          ? metadata.requestBodyContentType
          : bodyMediaType,
        body as PrimitiveTypesForDeserializationType,
      );
    }
  } else if (
    metadata.requestInformationContentSetMethod === "setStreamContent"
  ) {
    if (!body) throw new Error("body cannot be undefined");
    requestInfo.setStreamContent(
      body as ArrayBuffer,
      metadata.requestBodyContentType
        ? metadata.requestBodyContentType
        : bodyMediaType,
    );
  }
  return requestInfo;
}
function addAcceptHeaderIfPresent(
  metadata: RequestMetadata,
  requestInfo: RequestInformation,
): void {
  if (metadata.responseBodyContentType) {
    requestInfo.headers.tryAdd("Accept", metadata.responseBodyContentType);
  }
}
function getRequestMediaTypeUserDefinedValue(
  requestMetadata: RequestMetadata,
  args: any[],
) {
  if (
    args.length > 2 &&
    !requestMetadata.requestBodySerializer &&
    requestMetadata.requestInformationContentSetMethod === "setStreamContent"
  ) {
    // request body with unknown media type so we have an argument for it.
    return args[1];
  }
  return undefined;
}
function getRequestConfigurationValue(args: any[]) {
  if (args.length > 0) {
    // request configuration is always the last argument
    return args[args.length - 1];
  }
  return undefined;
}
function sendAsync(
  requestAdapter: RequestAdapter,
  requestInfo: RequestInformation,
  metadata: RequestMetadata,
) {
  switch (metadata.adapterMethodName) {
    case "sendAsync":
      if (!metadata.responseBodyFactory) {
        throw new Error("couldn't find response body factory");
      }
      return requestAdapter.sendAsync(
        requestInfo,
        metadata.responseBodyFactory as ParsableFactory<Parsable>,
        metadata.errorMappings,
      );
    case "sendCollectionAsync":
      if (!metadata.responseBodyFactory) {
        throw new Error("couldn't find response body factory");
      }
      return requestAdapter.sendCollectionAsync(
        requestInfo,
        metadata.responseBodyFactory as ParsableFactory<Parsable>,
        metadata.errorMappings,
      );
    case "sendCollectionOfPrimitiveAsync":
      if (!metadata.responseBodyFactory) {
        throw new Error("couldn't find response body factory");
      }
      return requestAdapter.sendCollectionOfPrimitiveAsync(
        requestInfo,
        metadata.responseBodyFactory as Exclude<
          PrimitiveTypesForDeserialization,
          "ArrayBuffer"
        >,
        metadata.errorMappings,
      );
    case "sendPrimitiveAsync":
      if (!metadata.responseBodyFactory) {
        throw new Error("couldn't find response body factory");
      }
      return requestAdapter.sendPrimitiveAsync(
        requestInfo,
        metadata.responseBodyFactory as PrimitiveTypesForDeserialization,
        metadata.errorMappings,
      );
    case "sendNoResponseContentAsync":
      return requestAdapter.sendNoResponseContentAsync(
        requestInfo,
        metadata.errorMappings,
      );
    default:
      throw new Error("couldn't find adapter method");
  }
}
export function apiClientProxifier<T extends object>(
  requestAdapter: RequestAdapter,
  pathParameters: Record<string, unknown>,
  urlTemplate: string,
  navigationMetadata?: Record<string, NavigationMetadata>,
  requestsMetadata?: RequestsMetadata,
): T {
  if (!requestAdapter) throw new Error("requestAdapter cannot be undefined");
  if (!pathParameters) throw new Error("pathParameters cannot be undefined");
  if (!urlTemplate) throw new Error("urlTemplate cannot be undefined");
  return new Proxy({} as T, {
    get(target, property) {
      const name = String(property);
      if (name === "withUrl") {
        return (rawUrl: string) => {
          if (!rawUrl) throw new Error("rawUrl cannot be undefined");
          return apiClientProxifier(
            requestAdapter,
            getPathParameters(rawUrl),
            urlTemplate,
            navigationMetadata,
            requestsMetadata,
          );
        };
      }
      if (requestsMetadata) {
        const metadata = requestsMetadata[getRequestMethod(name)];
        if (metadata) {
          switch (name) {
            case "get":
              return (
                requestConfiguration?: RequestConfiguration<object> | undefined,
              ) => {
                const requestInfo = toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.GET,
                  undefined,
                  undefined,
                  requestConfiguration,
                );
                return sendAsync(requestAdapter, requestInfo, metadata);
              };
            case "patch":
              return (...args: any[]) => {
                const requestInfo = toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.PATCH,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
                return sendAsync(requestAdapter, requestInfo, metadata);
              };
            case "put":
              return (...args: any[]) => {
                const requestInfo = toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.PUT,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
                return sendAsync(requestAdapter, requestInfo, metadata);
              };
            case "delete":
              return (...args: any[]) => {
                const requestInfo = toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.DELETE,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
                return sendAsync(requestAdapter, requestInfo, metadata);
              };
            case "post":
              return (...args: any[]) => {
                const requestInfo = toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.POST,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
                return sendAsync(requestAdapter, requestInfo, metadata);
              };
            case "toGetRequestInformation":
              return (requestConfiguration?: RequestConfiguration<object>) => {
                return toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.GET,
                  undefined,
                  undefined,
                  requestConfiguration,
                );
              };
            case "toPatchRequestInformation":
              return (...args: any[]) => {
                return toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.PATCH,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
              };
            case "toPutRequestInformation":
              return (...args: any[]) => {
                return toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.PUT,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
              };
            case "toDeleteRequestInformation":
              return (...args: any[]) => {
                return toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.DELETE,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
              };
            case "toPostRequestInformation":
              return (...args: any[]) => {
                return toRequestInformation(
                  urlTemplate,
                  pathParameters,
                  metadata,
                  requestAdapter,
                  HttpMethod.POST,
                  args.length > 0 ? args[0] : undefined,
                  getRequestMediaTypeUserDefinedValue(metadata, args),
                  getRequestConfigurationValue(args),
                );
              };
            default:
              break;
          }
        }
      }
      if (navigationMetadata) {
        const navigationCandidate = navigationMetadata[name];
        if (navigationCandidate) {
          if (
            !navigationCandidate.pathParametersMappings ||
            navigationCandidate.pathParametersMappings.length === 0
          ) {
            // navigation property
            return apiClientProxifier(
              requestAdapter,
              getPathParameters(pathParameters),
              navigationCandidate.uriTemplate,
              navigationCandidate.navigationMetadata,
              navigationCandidate.requestsMetadata,
            );
          }
          return (...argArray: any[]) => {
            // navigation method like indexers or multiple path parameters
            const downWardPathParameters = getPathParameters(pathParameters);
            if (
              navigationCandidate.pathParametersMappings &&
              navigationCandidate.pathParametersMappings.length > 0
            ) {
              for (let i = 0; i < argArray.length; i++) {
                const element = argArray[i];
                downWardPathParameters[
                  navigationCandidate.pathParametersMappings[i]
                ] = element;
              }
            }
            return apiClientProxifier(
              requestAdapter,
              downWardPathParameters,
              navigationCandidate.uriTemplate,
              navigationCandidate.navigationMetadata,
              navigationCandidate.requestsMetadata,
            );
          };
        }
        throw new Error(
          `couldn't find navigation property ${name} data: ${JSON.stringify(
            navigationMetadata,
          )}`,
        );
      }
    },
  });
}

export interface RequestMetadata {
  requestBodyContentType?: string;
  responseBodyContentType?: string;
  errorMappings?: ErrorMappings;
  adapterMethodName?: keyof RequestAdapter;
  responseBodyFactory?:
    | ParsableFactory<Parsable>
    | PrimitiveTypesForDeserialization;
  requestBodySerializer?:
    | ModelSerializerFunction<Parsable>
    | PrimitiveTypesForDeserialization;
  requestInformationContentSetMethod?: keyof RequestInformationSetContent;
  queryParametersMapper?: Record<string, string>;
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
  uriTemplate: string;
  requestsMetadata?: RequestsMetadata;
  navigationMetadata?: Record<string, NavigationMetadata>;
  pathParametersMappings?: string[];
}

export type KeysToExcludeForNavigationMetadata =
  | KeysOfRequestsMetadata
  | "toDeleteRequestInformation"
  | "toGetRequestInformation"
  | "toHeadRequestInformation"
  | "toOptionsRequestInformation"
  | "toPatchRequestInformation"
  | "toPostRequestInformation"
  | "toPutRequestInformation"
  | "withUrl";
