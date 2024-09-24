/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module DummyHTTPMessageHandler
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";

import type { Middleware } from "../../../src/middlewares/middleware";

/**
 * @class
 * @implements Middleware
 * Class representing DummyHTTPMessageHandler
 */
export class DummyFetchHandler implements Middleware {
	/**
	 * @private
	 * A member holding the array of response objects
	 */
	private responses: Response[];

	next;

	/**
	 * @public
	 * @constructor
	 * To create an instance of DummyHTTPMessageHandler
	 * @param {Response[]} [responses = []] - The array of response objects
	 * @returns An instance of DummyHTTPMessageHandler
	 */
	public constructor(responses: Response[] = []) {
		this.responses = responses;
	}

	/**
	 * @public
	 * To set the array of responses
	 * @param {Response[]} response - The array of responses
	 * @returns Nothing
	 */
	public setResponses(responses: Response[]): void {
		this.responses = responses;
	}

	/**
	 * @public
	 * @async
	 * To execute the current middleware
	 * @param {Context} context - The request context object
	 * @returns A promise that resolves to nothing
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		const response = this.responses.shift();
		this.urls.push(url);
		this.requests.push(requestInit);
		if (!response) {
			throw new Error("No response was found for the request");
		}
		return response;
	}

	public urls: string[] = [];

	public requests: RequestInit[] = [];
}
