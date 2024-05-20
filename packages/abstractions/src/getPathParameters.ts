/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { RequestInformation } from "./requestInformation";

export const getPathParameters = (parameters: Record<string, unknown> | string | undefined): Record<string, unknown> => {
	const result: Record<string, unknown> = {};
	if (typeof parameters === "string") {
		result[RequestInformation.raw_url_key] = parameters;
	} else if (parameters) {
		for (const key in parameters) {
      if (Object.prototype.hasOwnProperty.call(parameters, key)) {
			  result[key] = parameters[key];
      }
		}
	}
	return result;
}
