/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module ChaosHandlerOptions
 */

import { type FetchHeaders } from "../../utils/fetchDefinitions";
import { type ChaosStrategy } from "./chaosStrategy";

export const ChaosHandlerOptionsKey = "ChaosHandlerOptionsKey";

/**
 * interface representing ChaosHandlerOptions
 */
export interface ChaosHandlerOptions {
	/**
	 * Specifies the base url path for the destination server, used when relative paths are preferred to strip out paths
	 */
	baseUrl?: string;
	/**
	 * Specifies the startegy used for the Testing Handler -> RANDOM/MANUAL
	 */
	chaosStrategy: ChaosStrategy;

	/**
	 * Status code to be returned in the response
	 */
	statusCode?: number;

	/**
	 * The Message to be returned in the response
	 */
	statusMessage: string;

	/**
	 * The percentage of randomness/chaos in the handler
	 *
	 * Setting the default value as 10%
	 */
	chaosPercentage: number;

	/**
	 * The response body to be returned in the response
	 */
	responseBody?: any;

	/**
	 * The response headers to be returned in the response
	 */
	headers?: FetchHeaders;
}
