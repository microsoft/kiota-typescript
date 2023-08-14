/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module ChaosHandlerOptions
 */

import { FetchHeaders } from "../../utils/fetchDefinitions";
import { ChaosStrategy } from "./chaosStrategy";

export const ChaosHandlerOptionsKey = "ChaosHandlerOptionsKey";

/**
 * interface representing ChaosHandlerOptions
 * @interface
 * interface
 * @implements MiddlewareOptions
 */
export interface ChaosHandlerOptions {
	/**
	 * Speficies the base url path for the destination server, used when relative paths are preffered to strip out paths
	 *
	 * @public
	 */
	baseUrl?: string;
	/**
	 * Specifies the startegy used for the Testing Handler -> RANDOM/MANUAL
	 *
	 * @public
	 */
	chaosStrategy: ChaosStrategy;

	/**
	 * Status code to be returned in the response
	 *
	 * @public
	 */
	statusCode?: number;

	/**
	 * The Message to be returned in the response
	 *
	 * @public
	 */
	statusMessage: string;

	/**
	 * The percentage of randomness/chaos in the handler
	 *
	 * Setting the default value as 10%
	 * @public
	 */
	chaosPercentage: number;

	/**
	 * The response body to be returned in the response
	 *
	 * @public
	 */
	responseBody?: any;

	/**
	 * The response headers to be returned in the response
	 *
	 * @public
	 */
	headers?: FetchHeaders;
}
