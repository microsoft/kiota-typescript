/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type RequestOption, Headers } from "@microsoft/kiota-abstractions";

export const HeadersInspectionOptionsKey = "HeadersInspectionOptionsKey";

/**
 * @interface
 * Signature to define the HeadersInspectionOptions constructor parameters
 * @property {boolean} [inspectRequestHeaders = false] - Whether to inspect request headers
 * @property {boolean} [inspectResponseHeaders = false] - Whether to inspect response headers
 */
export interface HeadersInspectionOptionsParams {
	/**
	 * @member
	 * whether to inspect request headers
	 */
	inspectRequestHeaders?: boolean;
	/**
	 * @member
	 * whether to inspect response headers
	 */
	inspectResponseHeaders?: boolean;
}

/**
 * @class
 * @implements RequestOption
 * Options
 * Options to inspect headers
 */
export class HeadersInspectionOptions implements RequestOption {
	private readonly requestHeaders: Headers = new Headers();
	private readonly responseHeaders = new Headers();
	/**
	 * @public
	 * @getter
	 * Gets the request headers
	 * @returns the request headers
	 */
	public getRequestHeaders() {
		return this.requestHeaders;
	}

	/**
	 * @public
	 * @getter
	 * Gets the response headers
	 * @returns the response headers
	 */
	public getResponseHeaders() {
		return this.responseHeaders;
	}

	/**
	 * @public
	 * @member
	 * @default false
	 * whether to inspect request headers
	 */
	public inspectRequestHeaders: boolean;

	/**
	 * @public
	 * @member
	 * @default false
	 * whether to inspect response headers
	 */
	public inspectResponseHeaders: boolean;

	/**
	 * @public
	 * @constructor
	 * To create an instance of HeadersInspectionOptions
	 * @param {HeadersInspectionOptionsParams} [options = {}] - The headers inspection options value
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
