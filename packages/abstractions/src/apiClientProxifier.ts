import { getPathParameters } from "./getPathParameters";
import { HttpMethod } from "./httpMethod";
import type {
  PrimitiveTypesForDeserialization,
  PrimitiveTypesForDeserializationType,
  RequestAdapter,
} from "./requestAdapter";
import type { RequestConfiguration } from "./requestConfiguration";
import { RequestInformation } from "./requestInformation";
import type {
  ModelSerializerFunction,
  Parsable,
  ParsableFactory,
} from "./serialization";

function getRequestMetadata(key: string): string {
  if (key.startsWith("to")) {
    return key.substring(2).replace("RequestInformation", "").toLowerCase();
  }
  return key;
}

function toRequestInformation<QueryParametersType extends object>(
  urlTemplate: string,
  pathParameters: Record<string, unknown>,
  metadata: RequestMetadata,
  requestAdapter: RequestAdapter,
  httpMethod: HttpMethod,
  body?: unknown,
  requestConfiguration?: RequestConfiguration<QueryParametersType> | undefined,
): RequestInformation {
  const requestInfo = new RequestInformation(
    httpMethod,
    urlTemplate,
    pathParameters,
  );
  requestInfo.configure(requestConfiguration, metadata.queryParametersMapper);
  addAcceptHeaderIfPresent(metadata, requestInfo);
  if (metadata.requestBodyContentType && metadata.requestBodySerializer) {
    if (!body) throw new Error("body cannot be undefined");
    if (typeof metadata.requestBodySerializer === "function") {
      requestInfo.setContentFromParsable(
        requestAdapter,
        metadata.requestBodyContentType,
        body,
        metadata.requestBodySerializer,
      );
    } else {
      requestInfo.setContentFromScalar(
        requestAdapter,
        metadata.requestBodyContentType,
        body as PrimitiveTypesForDeserializationType,
      );
    }
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
function getRequestConfigurationValue(
  requestMetadata: RequestMetadata,
  args: any[],
) {
  if (args.length > 1 && requestMetadata.requestBodySerializer) {
    return args[1];
  } else if (args.length > 0 && !requestMetadata.requestBodySerializer) {
    return args[0];
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
  requestsMetadata?: Record<string, RequestMetadata>,
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
        const metadata = requestsMetadata[getRequestMetadata(name)];
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
                  getRequestConfigurationValue(metadata, args),
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
                  getRequestConfigurationValue(metadata, args),
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
                  getRequestConfigurationValue(metadata, args),
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
                  getRequestConfigurationValue(metadata, args),
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
                  getRequestConfigurationValue(metadata, args),
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
                  getRequestConfigurationValue(metadata, args),
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
                  getRequestConfigurationValue(metadata, args),
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
                  getRequestConfigurationValue(metadata, args),
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
  errorMappings?: Record<string, ParsableFactory<Parsable>>;
  adapterMethodName?: keyof RequestAdapter;
  responseBodyFactory?:
    | ParsableFactory<Parsable>
    | PrimitiveTypesForDeserialization;
  requestBodySerializer?:
    | ModelSerializerFunction<Parsable>
    | PrimitiveTypesForDeserialization;
  queryParametersMapper?: Record<string, string>;
}

export interface NavigationMetadata {
  uriTemplate: string;
  requestsMetadata?: Record<string, RequestMetadata>;
  navigationMetadata?: Record<string, NavigationMetadata>;
  pathParametersMappings?: string[];
}

export type KeysToExcludeForNavigationMetadata =
  | "get"
  | "post"
  | "patch"
  | "put"
  | "delete"
  | "toGetRequestInformation"
  | "toPostRequestInformation"
  | "toPatchRequestInformation"
  | "toPutRequestInformation"
  | "toDeleteRequestInformation"
  | "withUrl";
