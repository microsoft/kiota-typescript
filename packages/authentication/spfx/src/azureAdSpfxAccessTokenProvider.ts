/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type AccessTokenProvider, AllowedHostsValidator, validateProtocol } from "@microsoft/kiota-abstractions";
import { type AadTokenProvider } from "@microsoft/sp-http";
import { type Span, trace } from "@opentelemetry/api";

import { type ObservabilityOptions, ObservabilityOptionsImpl } from "./observabilityOptions";

export class AzureAdSpfxAccessTokenProvider implements AccessTokenProvider {
	private readonly allowedHostsValidator: AllowedHostsValidator;

	/**
	 *@param tokenProvider The tokenProvider provided by the SharePoint framework
	 *@param applicationIdUri The application ID URI of the Azure AD App that we want to Authenticate
	 *@param allowedHosts The allowed hosts to use for authentication.
	 *@param useCachedToken Allows the developer to specify if cached tokens should be returned.
	 *@param observabilityOptions The observability options to use for authentication.
	 */
	public constructor(
		private readonly tokenProvider: AadTokenProvider,
		private readonly applicationIdUri: string,
		allowedHosts: Set<string> = new Set<string>(),
		private readonly useCachedToken?: boolean,
		private readonly observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl(),
	) {
		if (!tokenProvider) {
			throw new Error("parameter tokenProvider cannot be null");
		}
		if (!applicationIdUri) {
			throw new Error("applicationIdUri cannot be null or empty");
		}
		if (!observabilityOptions) {
			throw new Error("observabilityOptions cannot be null");
		}
		this.allowedHostsValidator = new AllowedHostsValidator(allowedHosts);
	}

	/**
	 * @inheritdoc
	 */
	public getAuthorizationToken = (url?: string, additionalAuthenticationContext?: Record<string, unknown>): Promise<string> => {
		return trace.getTracer(this.observabilityOptions.getTracerInstrumentationName()).startActiveSpan("getAuthorizationToken", (span) => {
			try {
				return this.getAuthorizationTokenInternal(url, additionalAuthenticationContext, span);
			} finally {
				span.end();
			}
		});
	};
	private readonly getAuthorizationTokenInternal = async (
		url?: string,

		additionalAuthenticationContext?: Record<string, unknown>,
		span?: Span,
	): Promise<string> => {
		if (!url || !this.allowedHostsValidator.isUrlHostValid(url)) {
			span?.setAttribute("com.microsoft.kiota.authentication.is_url_valid", false);
			return "";
		}

		validateProtocol(url);
		span?.setAttribute("com.microsoft.kiota.authentication.is_url_valid", true);

		span?.setAttribute("com.microsoft.kiota.authentication.scopes", this.applicationIdUri);
		const accessToken: string = await this.tokenProvider.getToken(this.applicationIdUri, this.useCachedToken);

		return accessToken ?? "";
	};

	/**
	 * @inheritdoc
	 */
	public getAllowedHostsValidator = () => this.allowedHostsValidator;
}
