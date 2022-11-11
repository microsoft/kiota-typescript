import { RequestOption } from "@microsoft/kiota-abstractions";

export interface ObservabilityOptions {
	includeEUIIAttributes: boolean;
}
export interface ObservabilityOptionsInternal {
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

export function getObservabilityOptionsFromRequest(requestOptions?: Record<string, RequestOption>): ObservabilityOptionsInternal | undefined {
	if (requestOptions) {
		const observabilityOptions = requestOptions[ObservabilityOptionKey];
		if (observabilityOptions instanceof ObservabilityOptionsImpl) {
			return observabilityOptions;
		}
	}
	return undefined;
}
