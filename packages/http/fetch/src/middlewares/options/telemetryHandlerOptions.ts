/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { RequestOption } from "@microsoft/kiota-abstractions";

export interface TelemetryHandlerOptions extends RequestOption {
	telemetryConfigurator: (url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>, telemetryInformation?: unknown) => void;
	telemetryInformation?: unknown;
}
