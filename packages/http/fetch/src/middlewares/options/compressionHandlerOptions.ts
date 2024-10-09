/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module RetryHandlerOptions
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";

/**
 * Key for the compression replace handler options.
 */
export const CompressionHandlerOptionsKey = "CompressionHandlerOptionsKey";

/**
 * Options for the compression handler.
 */
export class CompressionHandlerOptions implements RequestOption {
	private readonly _enableCompression: boolean;
	/**
	 * Create a new instance of the CompressionHandlerOptions class
	 * @param config the configuration to apply to the compression handler options.
	 */
	public constructor(config?: Partial<CompressionHandlerOptionsParams>) {
		this._enableCompression = config?.enableCompression ?? true;
	}
	/**
	 * @inheritdoc
	 */
	public getKey(): string {
		return CompressionHandlerOptionsKey;
	}
	/**
	 * Returns whether the compression handler is enabled or not.
	 * @returns whether the compression handler is enabled or not.
	 */
	public get ShouldCompress(): boolean {
		return this._enableCompression;
	}
}

/**
 * Parameters for the CompressionHandlerOptionsParams class constructor
 */
export interface CompressionHandlerOptionsParams {
	enableCompression: boolean;
}
