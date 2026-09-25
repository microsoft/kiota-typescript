/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { type AccountInfo, type AuthenticationResult, type IPublicClientApplication, InteractionRequiredAuthError, InteractionRequiredAuthErrorCodes, InteractionType, type PopupRequest, type RedirectRequest, type SilentRequest } from "@azure/msal-browser";
import { type AccessTokenProvider, AllowedHostsValidator, inNodeEnv, isLocalhostUrl, validateProtocol } from "@microsoft/kiota-abstractions";
import { type Span, trace } from "@opentelemetry/api";

import { type MsalBrowserAuthenticationConfig } from "./msalBrowserAuthenticationConfig";
import { type ObservabilityOptions, ObservabilityOptionsImpl } from "./observabilityOptions";

/** Access token provider that leverages the MSAL Browser library to retrieve an access token. */
export class MsalBrowserAccessTokenProvider implements AccessTokenProvider {
	private readonly allowedHostsValidator: AllowedHostsValidator;
	private readonly clientApplication: IPublicClientApplication;
	private readonly account?: AccountInfo;
	private readonly interactionType: InteractionType;
	private readonly scopes: string[];
	private static readonly claimsKey = "claims";

	/**
	 * @param config The MSAL Browser authentication configuration containing public client application, scopes, account and interaction type.
	 * @param allowedHosts The allowed hosts to use for authentication.
	 * @param observabilityOptions The observability options to use.
	 */
	public constructor(
		config: MsalBrowserAuthenticationConfig,
		allowedHosts: Set<string> = new Set<string>(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn", "canary.graph.microsoft.com"]),
		private readonly observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl(),
	) {
		if (!config) {
			throw new Error("config cannot be null or undefined");
		}
		if (!config.clientApplication) {
			throw new Error("config.clientApplication cannot be null or undefined");
		}
		if (!observabilityOptions) {
			throw new Error("observabilityOptions cannot be null");
		}
		this.clientApplication = config.clientApplication;
		this.account = config.account;
		this.interactionType = config.interactionType ?? InteractionType.Popup;
		this.scopes = config.scopes ?? [];
		this.allowedHostsValidator = new AllowedHostsValidator(allowedHosts);
	}

	/**
	 * @inheritdoc
	 */
	public getAuthorizationToken = (url?: string, additionalAuthenticationContext?: Record<string, unknown>): Promise<string> => {
		return trace.getTracer(this.observabilityOptions.getTracerInstrumentationName()).startActiveSpan("getAuthorizationToken", async (span) => {
			try {
				return await this.getAuthorizationTokenInternal(url, additionalAuthenticationContext, span);
			} finally {
				span.end();
			}
		});
	};

	private readonly getAuthorizationTokenInternal = async (url?: string, additionalAuthenticationContext?: Record<string, unknown>, span?: Span): Promise<string> => {
		if (!url || !this.allowedHostsValidator.isUrlHostValid(url)) {
			span?.setAttribute("com.microsoft.kiota.authentication.is_url_valid", false);
			return "";
		}
		this.validateRequestUrlProtocol(url);
		span?.setAttribute("com.microsoft.kiota.authentication.is_url_valid", true);

		let decodedClaims = "";
		if (additionalAuthenticationContext?.[MsalBrowserAccessTokenProvider.claimsKey]) {
			const rawClaims = additionalAuthenticationContext[MsalBrowserAccessTokenProvider.claimsKey] as string;
			decodedClaims = inNodeEnv() ? Buffer.from(rawClaims, "base64").toString() : atob(rawClaims);
		}
		span?.setAttribute("com.microsoft.kiota.authentication.additional_claims_provided", decodedClaims !== "");

		let scopes = this.scopes;
		if (scopes.length === 0) {
			const [scheme, host] = this.getSchemeAndHostFromUrl(url);
			scopes = [`${scheme}://${host}/.default`];
		}
		span?.setAttribute("com.microsoft.kiota.authentication.scopes", scopes.join(","));

		const silentRequest: SilentRequest = {
			scopes,
			account: this.account,
			claims: decodedClaims || undefined,
		};

		try {
			const response: AuthenticationResult = await this.clientApplication.acquireTokenSilent(silentRequest);
			return response?.accessToken ?? "";
		} catch (error) {
			if (this.isInteractionRequired(error)) {
				if (this.interactionType === InteractionType.Popup) {
					const popupRequest: PopupRequest = {
						scopes,
						account: this.account,
						claims: decodedClaims || undefined,
					};
					const response: AuthenticationResult = await this.clientApplication.acquireTokenPopup(popupRequest);
					return response?.accessToken ?? "";
				} else if (this.interactionType === InteractionType.Redirect) {
					const redirectRequest: RedirectRequest = {
						scopes,
						account: this.account,
						claims: decodedClaims || undefined,
					};
					await this.clientApplication.acquireTokenRedirect(redirectRequest);
					return "";
				}
			}
			throw error;
		}
	};

	private readonly isInteractionRequired = (error: unknown): boolean => {
		if (error instanceof InteractionRequiredAuthError) {
			return true;
		}
		if (error && typeof error === "object") {
			const authErr = error as { name?: string; errorCode?: string };
			if (authErr.name === "InteractionRequiredAuthError") {
				return true;
			}
			if (typeof authErr.errorCode === "string") {
				const errorCodes: string[] = Object.values(InteractionRequiredAuthErrorCodes);
				if (errorCodes.includes(authErr.errorCode)) {
					return true;
				}
			}
		}
		return false;
	};

	private readonly validateRequestUrlProtocol = (url: string): void => {
		validateProtocol(url);
		let parsedUrl: URL | undefined;
		try {
			const baseUrl = !inNodeEnv() && typeof window !== "undefined" && window.location ? window.location.href : undefined;
			parsedUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
		} catch {
			// URL cannot be parsed as absolute URL
		}
		if (parsedUrl) {
			if (!isLocalhostUrl(parsedUrl.href) && parsedUrl.protocol.toLocaleLowerCase() !== "https:") {
				throw new Error("Authentication scheme can only be used with https requests");
			}
		} else if (!isLocalhostUrl(url) && (url.toLocaleLowerCase().startsWith("http://") || !url.toLocaleLowerCase().startsWith("https://"))) {
			throw new Error("Authentication scheme can only be used with https requests");
		}
	};

	private readonly getSchemeAndHostFromUrl = (url: string): string[] => {
		const urlParts = url.split("://");
		if (urlParts.length === 0) {
			return [this.getSchemeFromLocation(), this.getHostFromLocation()];
		} else if (urlParts.length === 1) {
			return [this.getSchemeFromLocation(), urlParts[0].split("/")[0]];
		} else if (urlParts.length >= 2) {
			return [urlParts[0], urlParts[1].split("/")[0]];
		} else {
			throw new Error("invalid url");
		}
	};

	private readonly getSchemeFromLocation = (): string => {
		if (!inNodeEnv() && typeof window !== "undefined" && window.location) {
			return window.location.protocol.replace(":", "");
		}
		return "https";
	};

	private readonly getHostFromLocation = (): string => {
		if (!inNodeEnv() && typeof window !== "undefined" && window.location) {
			return window.location.host;
		}
		return "";
	};

	/**
	 * @inheritdoc
	 */
	public getAllowedHostsValidator = () => this.allowedHostsValidator;
}
