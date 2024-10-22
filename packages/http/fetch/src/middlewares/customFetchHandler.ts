/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module FetchHandler
 */

import type { Middleware } from "./middleware";

/**
 * @class
 * @implements Middleware
 * Class for FetchHandler
 */

export class CustomFetchHandler implements Middleware {
	/**
	 * @private
	 * The next middleware in the middleware chain
	 */
	next: Middleware | undefined;

	constructor(private readonly customFetch: (input: string, init: RequestInit) => Promise<Response>) {}

	/**
	 * @inheritdoc
	 */
	public async execute(url: string, requestInit: RequestInit): Promise<Response> {
		return await this.customFetch(url, requestInit);
	}
}
