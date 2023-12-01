import { getPathParameters } from "./getPathParameters";
import type { RequestAdapter } from "./requestAdapter";

export abstract class BaseRequestBuilder<T> {
  /** Path parameters for the request */
  protected pathParameters: Record<string, unknown>;
  /** The request adapter to use to execute the requests. */
  protected requestAdapter: RequestAdapter;
  /** Url template to use to build the URL for the current request builder */
  protected urlTemplate: string;
  private withUrlFactory: WithUrlFactory<T>;
  protected constructor(
    pathParameters: Record<string, unknown> | string | undefined,
    requestAdapter: RequestAdapter,
    urlTemplate: string,
    factory: WithUrlFactory<T>,
  ) {
    if (!requestAdapter) throw new Error("requestAdapter cannot be undefined");
    if (urlTemplate === undefined) {
      // empty string is ok
      throw new Error("urlTemplate cannot be undefined");
    }
    if (!factory) throw new Error("factory cannot be undefined");
    this.pathParameters = getPathParameters(pathParameters);
    this.requestAdapter = requestAdapter;
    this.urlTemplate = urlTemplate;
    this.withUrlFactory = factory;
  }
  /**
   * Returns a request builder with the provided arbitrary URL. Using this method means any other path or query parameters are ignored.
   * @param rawUrl The raw URL to use for the request builder.
   * @returns a MessageItemRequestBuilder
   */
  public withUrl(rawUrl: string): T {
    if (!rawUrl) throw new Error("rawUrl cannot be undefined");
    return this.withUrlFactory(rawUrl, this.requestAdapter);
  }
}

type WithUrlFactory<T> = (
  pathParameters: Record<string, unknown> | string | undefined,
  requestAdapter: RequestAdapter,
) => T;
