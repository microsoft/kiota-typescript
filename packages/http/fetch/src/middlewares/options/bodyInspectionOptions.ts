/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type RequestOption } from "@microsoft/kiota-abstractions";

export const BodyInspectionOptionsKey = "BodyInspectionOptionsKey";

/**
 * Signature to define the BodyInspectionOptions constructor parameters
 */
export interface BodyInspectionOptionsParams {
	/**
	 * Whether to inspect request body
	 */
	inspectRequestBody?: boolean;
	/**
	 * Whether to inspect response body
	 */
	inspectResponseBody?: boolean;
}

/**
 * RequestOption
 * Options to inspect request and response bodies
 * Note that inspecting bodies creates in-memory copies which increases memory usage.
 */
export class BodyInspectionOptions implements RequestOption {
	private _requestBody?: ArrayBuffer;
	private _responseBody?: ArrayBuffer;

	/**
	 * Gets the request body as an ArrayBuffer.
	 * Returns undefined if request body inspection was not enabled or if the request contains no body.
	 * @returns the request body buffer
	 */
	public get requestBody(): ArrayBuffer | undefined {
		return this._requestBody;
	}

	/**
	 * Sets the request body buffer
	 * @param body the request body buffer
	 */
	public set requestBody(body: ArrayBuffer | undefined) {
		this._requestBody = body;
	}

	/**
	 * Gets the response body as an ArrayBuffer.
	 * Returns undefined if response body inspection was not enabled or if the response contains no body.
	 * @returns the response body buffer
	 */
	public get responseBody(): ArrayBuffer | undefined {
		return this._responseBody;
	}

	/**
	 * Sets the response body buffer
	 * @param body the response body buffer
	 */
	public set responseBody(body: ArrayBuffer | undefined) {
		this._responseBody = body;
	}

	/**
	 * Gets the request body as an ArrayBuffer.
	 * @deprecated Use the `requestBody` property instead.
	 * @returns the request body buffer
	 */
	public getRequestBody(): ArrayBuffer | undefined {
		return this._requestBody;
	}

	/**
	 * Sets the request body buffer
	 * @deprecated Use the `requestBody` property instead.
	 * @param body the request body buffer
	 */
	public setRequestBody(body?: ArrayBuffer): void {
		this._requestBody = body;
	}

	/**
	 * Gets the response body as an ArrayBuffer.
	 * @deprecated Use the `responseBody` property instead.
	 * @returns the response body buffer
	 */
	public getResponseBody(): ArrayBuffer | undefined {
		return this._responseBody;
	}

	/**
	 * Sets the response body buffer
	 * @deprecated Use the `responseBody` property instead.
	 * @param body the response body buffer
	 */
	public setResponseBody(body?: ArrayBuffer): void {
		this._responseBody = body;
	}

	/**
	 * @default false
	 * Whether to inspect request body
	 */
	public inspectRequestBody: boolean;

	/**
	 * @default false
	 * Whether to inspect response body
	 */
	public inspectResponseBody: boolean;

	/**
	 * Creates an instance of BodyInspectionOptions
	 * @param [options] - The body inspection options value
	 * @returns An instance of BodyInspectionOptions
	 * @example const options = new BodyInspectionOptions({ inspectRequestBody: true, inspectResponseBody: true });
	 */
	public constructor(options: Partial<BodyInspectionOptionsParams> = {}) {
		this.inspectRequestBody = options.inspectRequestBody ?? false;
		this.inspectResponseBody = options.inspectResponseBody ?? false;
	}

	public getKey(): string {
		return BodyInspectionOptionsKey;
	}
}
