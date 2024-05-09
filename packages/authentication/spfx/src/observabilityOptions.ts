/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

export interface ObservabilityOptions {
	getTracerInstrumentationName(): string;
}

export class ObservabilityOptionsImpl implements ObservabilityOptions {
	getTracerInstrumentationName(): string {
		return "@microsoft/kiota-authentication-spfx";
	}
}
