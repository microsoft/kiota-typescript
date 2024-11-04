/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { RequestOption } from "@microsoft/kiota-abstractions";

import type { Middleware } from "./middleware";
import type { TelemetryHandlerOptions } from "./options/telemetryHandlerOptions";

export const TelemetryHandlerOptionsKey = "TelemetryHandlerOptionsKey";
export class TelemetryHandler implements Middleware {
	constructor(private readonly telemetryHandlerOptions: TelemetryHandlerOptions) {}
	next: Middleware | undefined;
	execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		if (this.telemetryHandlerOptions?.telemetryConfigurator) {
			this.telemetryHandlerOptions.telemetryConfigurator(url, requestInit, requestOptions, this.telemetryHandlerOptions.telemetryInformation);
		} else if (requestOptions?.[TelemetryHandlerOptionsKey]) {
			(requestOptions[TelemetryHandlerOptionsKey] as TelemetryHandlerOptions).telemetryConfigurator(url, requestInit, requestOptions);
		}
		if (!this.next) {
			throw new Error("Please set the next middleware to continue the request");
		}
		return this.next.execute(url, requestInit, requestOptions);
	}
}
