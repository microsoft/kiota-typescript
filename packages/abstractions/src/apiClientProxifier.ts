import type { NextGenBaseRequestBuilder } from "./baseRequestBuilder";
import { getPathParameters } from "./getPathParameters";
import type { RequestAdapter } from "./requestAdapter";
import type {
  ModelSerializerFunction,
  Parsable,
  ParsableFactory,
} from "./serialization";

export function apiClientProxifier<T extends object>(
  apiClient: T,
  requestAdapter: RequestAdapter,
  pathParameters: Record<string, unknown>,
  urlTemplate: string,
  navigationMetadata?: Record<string, NavigationMetadata>,
  requestMetadata?: Record<string, RequestMetadata>,
): T {
  if (!requestAdapter) throw new Error("requestAdapter cannot be undefined");
  if (!pathParameters) throw new Error("pathParameters cannot be undefined");
  if (!urlTemplate) throw new Error("urlTemplate cannot be undefined");
  return new Proxy(apiClient, {
    get(target, property, receiver) {
      const name = String(property);

      // allow internal property access
      if (Reflect.has(target, name)) {
        return Reflect.get(target, name);
      }
      switch (name) {
        case "withUrl":
          return (rawUrl: string) => {
            if (!rawUrl) throw new Error("rawUrl cannot be undefined");
            return apiClientProxifier(
              {} as T,
              requestAdapter,
              getPathParameters(rawUrl),
              rawUrl,
              navigationMetadata,
              requestMetadata,
            );
          };
      }

      if (requestMetadata) {
        switch (name) {
          case "get":
          case "update":
          case "patch":
          case "post":
          case "delete":
            //TODO get the entry from the map and return it
            break;
          case "toGetRequestInformation":
          case "toUpdateRequestInformation":
          case "toPatchRequestInformation":
          case "toPostRequestInformation":
          case "toDeleteRequestInformation":
            //TODO get the entry from the map and return it
            break;
          default:
            break;
        }
      }

      //TODO missing the bySomething method parameters
      if (navigationMetadata) {
        const navigationCandidate = navigationMetadata[name];
        if (navigationCandidate) {
          return apiClientProxifier(
            {},
            requestAdapter,
            getPathParameters(pathParameters),
            navigationCandidate.uriTemplate,
            navigationCandidate.navigationMetadata,
            navigationCandidate.requestsMetadata,
          );
        }
      }

      return receiver; // So the API can be chained
    },
  });
}

export interface RequestMetadata {
  requestBodyContentType?: string;
  responseBodyContentType?: string;
  errorMappings?: Record<string, ParsableFactory<Parsable>>;
  adapterMethodName?: keyof RequestAdapter;
  responseBodyFactory?: ParsableFactory<Parsable>; // TODO primitive types
  requestBodySerializer?: ModelSerializerFunction<Parsable>;
  queryParametersMapper?: Record<string, string>;
}

export interface NavigationMetadata {
  uriTemplate: string;
  requestsMetadata?: Record<string, RequestMetadata>;
  navigationMetadata?: Record<string, NavigationMetadata>;
  pathParametersMappings?: string[];
}
