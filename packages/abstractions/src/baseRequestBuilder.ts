import { getPathParameters } from "./getPathParameters";
import type { RequestAdapter } from "./requestAdapter";

export abstract class BaseRequestBuilder {
  /** Path parameters for the request */
  protected pathParameters: Record<string, unknown>;
  /** The request adapter to use to execute the requests. */
  protected requestAdapter: RequestAdapter;
  /** Url template to use to build the URL for the current request builder */
  protected urlTemplate: string;
  protected constructor(
    pathParameters: Record<string, unknown> | string | undefined,
    requestAdapter: RequestAdapter,
    urlTemplate: string
  ) {
    if (!requestAdapter) throw new Error("requestAdapter cannot be undefined");
    if (urlTemplate === undefined) {
      // empty string is ok
      throw new Error("urlTemplate cannot be undefined");
    }
    this.pathParameters = getPathParameters(pathParameters);
    this.requestAdapter = requestAdapter;
    this.urlTemplate = urlTemplate;
  }
}
