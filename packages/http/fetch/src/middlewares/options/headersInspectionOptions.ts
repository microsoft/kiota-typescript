/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type RequestOption, Headers } from "@microsoft/kiota-abstractions";

export const HeadersInspectionOptionsKey = "HeadersInspectionOptionsKey";

/**
 * Signature to define the HeadersInspectionOptions constructor parameters
 */
export interface HeadersInspectionOptionsParams {
	/**
	 * whether to inspect request headers
	 */
	inspectRequestHeaders?: boolean;
	/**
	 * whether to inspect response headers
	 */
	inspectResponseHeaders?: boolean;
}

/**
 * RequestOption
 * Options
 * Options to inspect headers
 */
export class HeadersInspectionOptions implements RequestOption {
	private readonly requestHeaders: Headers = new Headers();
	private readonly responseHeaders = new Headers();
	/**
	 * Gets the request headers
	 * @returns the request headers
	 */
	public getRequestHeaders() {
		return this.requestHeaders;
	}

	/**
	 * Gets the response headers
	 * @returns the response headers
	 */
	public getResponseHeaders() {
		return this.responseHeaders;
	}

	/**
	 * @default false
	 * whether to inspect request headers
	 */
	public inspectRequestHeaders: boolean;

	/**
	 * @default false
	 * whether to inspect response headers
	 */
	public inspectResponseHeaders: boolean;

	/**
	 *
	 * To create an instance of HeadersInspectionOptions
	 * @param [options] - The headers inspection options value
	 * @returns An instance of HeadersInspectionOptions
	 * @example const options = new HeadersInspectionOptions({ inspectRequestHeaders: true, inspectResponseHeaders: true });
	 */
	public constructor(options: Partial<HeadersInspectionOptionsParams> = {}) {
		this.inspectRequestHeaders = options.inspectRequestHeaders ?? false;
		this.inspectResponseHeaders = options.inspectResponseHeaders ?? false;
	}

	public getKey(): string {
		return HeadersInspectionOptionsKey;
	}
}
