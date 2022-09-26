import { RequestOption } from "@microsoft/kiota-abstractions";

export interface ObservabilityOptions {
	includeEUIIAttributes: boolean;
	getTracerInstrumentationName(): string;
}
export const ObservabilityOptionKey = "ObservabilityOptionKey";
export class ObservabilityOptionsImpl implements ObservabilityOptions, RequestOption {
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
