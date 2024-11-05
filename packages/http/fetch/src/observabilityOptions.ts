/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { RequestOption } from "@microsoft/kiota-abstractions";

/** Holds the tracing, metrics and logging configuration for the request adapter */
export interface ObservabilityOptions {
	includeEUIIAttributes: boolean;
}
/** Internal interface not meant to be used externally and designed to facilitate JSON usage of the other interface. */
interface ObservabilityOptionsInternal {
	getTracerInstrumentationName(): string;
}
export const ObservabilityOptionKey = "ObservabilityOptionKey";
export class ObservabilityOptionsImpl implements ObservabilityOptions, ObservabilityOptionsInternal, RequestOption {
	private readonly _originalOptions: ObservabilityOptions;
	public constructor(originalOptions?: ObservabilityOptions) {
		this._originalOptions = originalOptions ?? ({} as ObservabilityOptions);
	}
	public getKey(): string {
		return ObservabilityOptionKey;
	}
	public get includeEUIIAttributes(): boolean {
		return this._originalOptions.includeEUIIAttributes;
	}
	public set includeEUIIAttributes(value: boolean) {
		this._originalOptions.includeEUIIAttributes = value;
	}
	public getTracerInstrumentationName(): string {
		return "@microsoft/kiota-http-fetchlibrary";
	}
}

/**
 * Gets the observability options from the request options
 * @param requestOptions The request options
 * @returns The observability options
 */
export function getObservabilityOptionsFromRequest(requestOptions?: Record<string, RequestOption>): ObservabilityOptionsInternal | undefined {
	if (requestOptions) {
		const observabilityOptions = requestOptions[ObservabilityOptionKey];
		if (observabilityOptions instanceof ObservabilityOptionsImpl) {
			return observabilityOptions;
		}
	}
	return undefined;
}
