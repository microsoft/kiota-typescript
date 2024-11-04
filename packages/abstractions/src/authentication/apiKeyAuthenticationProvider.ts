/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type RequestInformation } from "../requestInformation";
import { AllowedHostsValidator } from "./allowedHostsValidator";
import type { AuthenticationProvider } from "./authenticationProvider";
import { validateProtocol } from "./validateProtocol";

/** Authenticate a request by using an API Key */
export class ApiKeyAuthenticationProvider implements AuthenticationProvider {
	private readonly validator: AllowedHostsValidator;
	/**
	 * @param apiKey The API Key to use for authentication
	 * @param parameterName The name of the parameter to use for authentication
	 * @param location The location of the parameter to use for authentication
	 * @param validHosts The hosts that are allowed to use this authentication provider
	 */
	public constructor(
		private readonly apiKey: string,
		private readonly parameterName: string,
		private readonly location: ApiKeyLocation,
		validHosts?: Set<string>,
	) {
		if (apiKey === undefined || apiKey === "") {
			throw new Error("apiKey cannot be null or empty");
		}
		if (parameterName === undefined || parameterName === "") {
			throw new Error("parameterName cannot be null or empty");
		}
		if (location !== ApiKeyLocation.QueryParameter && location !== ApiKeyLocation.Header) {
			throw new Error("location must be either QueryParameter or Header");
		}
		this.validator = new AllowedHostsValidator(validHosts);
	}
	public authenticateRequest(
		request: RequestInformation,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		additionalAuthenticationContext?: Record<string, unknown>,
	): Promise<void> {
		const url = request.URL;
		if (!url || !this.validator.isUrlHostValid(url)) {
			return Promise.resolve();
		}
		validateProtocol(url);
		switch (this.location) {
			case ApiKeyLocation.QueryParameter:
				request.URL += (url.includes("?") ? "&" : "?") + this.parameterName + "=" + this.apiKey;
				break;
			case ApiKeyLocation.Header:
				request.headers.add(this.parameterName, this.apiKey);
				break;
		}
		return Promise.resolve();
	}
}
/** The location for the API key */
export enum ApiKeyLocation {
	/** The API key is in the query parameters */
	QueryParameter,
	/** The API key is in the headers */
	Header,
}
