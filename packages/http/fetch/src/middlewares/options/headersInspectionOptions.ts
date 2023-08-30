import { createRecordWithCaseInsensitiveKeys, type RequestOption } from "@microsoft/kiota-abstractions";
export const HeadersInspectionOptionsKey = "HeadersInspectionOptionsKey";
/**
 * @class
 * @implements RequestOption
 * Options
 * Options to inspect headers
 */
export class HeadersInspectionOptions implements RequestOption {
	private readonly requestHeaders = createRecordWithCaseInsensitiveKeys<string[]>();
	private readonly responseHeaders = createRecordWithCaseInsensitiveKeys<string[]>();
	/**
	 * @public
	 * @getter
	 * Gets the request headers
	 * @returns the request headers
	 */
	public getRequestHeaders() {
		return this.requestHeaders;
	}
	/**
	 * @public
	 * @getter
	 * Gets the response headers
	 * @returns the response headers
	 */
	public getResponseHeaders() {
		return this.responseHeaders;
	}
	/**
	 * @public
	 * @constructor
	 * To create an instance of HeadersInspectionOptions
	 * @param {boolean} [inspectRequestHeaders = false] - Whether to inspect request headers
	 * @param {boolean} [inspectResponseHeaders = false] - Whether to inspect response headers
	 * @returns An instance of HeadersInspectionOptions
	 */
	public constructor(
		public inspectRequestHeaders = false,
		public inspectResponseHeaders = false,
	) {}
	public getKey(): string {
		return HeadersInspectionOptionsKey;
	}
}
