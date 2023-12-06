import type { RequestOption } from "./requestOption";

/**
 * Request configuration
 * @template T Query parameters type
 */
export interface RequestConfiguration<T extends object> {
  /**
   * Request headers
   */
  headers?: Record<string, string | string[]>;
  /**
   * Request options
   */
  options?: RequestOption[];
  /**
   * Request query parameters
   */
  queryParameters?: T;
}
