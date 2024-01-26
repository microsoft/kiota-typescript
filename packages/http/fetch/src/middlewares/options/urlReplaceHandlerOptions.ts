import type { RequestOption } from "@microsoft/kiota-abstractions";
/**
 * Key for the url replace handler options.
 */
export const UrlReplaceHandlerOptionsKey = "UrlReplaceHandlerOptionsKey";
/**
 * Options for the url replace handler.
 */
export class UrlReplaceHandlerOptions implements RequestOption {
	private readonly _urlReplacements: Record<string, string>;
	private readonly _enabled: boolean;
	/**
	 * Create a new instance of the UrlReplaceHandlerOptions class
	 * @param config the configuration to apply to the url replace handler options.
	 */
	public constructor(config?: Partial<UrlReplaceHandlerOptionsParams>) {
		if (config) {
			this._urlReplacements = config.urlReplacements ?? {};
			this._enabled = config.enabled ?? true;
		} else {
			this._urlReplacements = {};
			this._enabled = true;
		}
	}
	/**
	 * @inheritdoc
	 */
	public getKey(): string {
		return UrlReplaceHandlerOptionsKey;
	}
	/**
	 * Returns whether the url replace handler is enabled or not.
	 * @returns whether the url replace handler is enabled or not.
	 */
	public get enabled(): boolean {
		return this._enabled;
	}
	/**
	 * Returns the url replacements combinations.
	 * @returns the url replacements combinations.
	 */
	public get urlReplacements(): Record<string, string> {
		return this._urlReplacements;
	}
}
/**
 * Parameters for the UrlReplaceHandlerOptions class constructor
 */
export interface UrlReplaceHandlerOptionsParams {
	urlReplacements: Record<string, string>;
	enabled: boolean;
}
