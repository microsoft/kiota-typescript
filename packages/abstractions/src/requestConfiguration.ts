/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
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
