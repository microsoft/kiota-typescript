import type { GetTokenOptions, TokenCredential } from "@azure/core-auth";
import { type AccessTokenProvider, AllowedHostsValidator, validateProtocol, inBrowserEnv } from "@microsoft/kiota-abstractions";
import { type Span, trace } from "@opentelemetry/api";

import { type ObservabilityOptions, ObservabilityOptionsImpl } from "./observabilityOptions";

/** Access token provider that leverages the Azure Identity library to retrieve an access token. */
export class AzureIdentityAccessTokenProvider implements AccessTokenProvider {
	/**
	 *@constructor
	 *@param credentials The tokenCredential implementation to use for authentication.
	 *@param scopes The scopes to use for authentication.
	 *@param options The options to use for authentication.
	 *@param allowedHosts The allowed hosts to use for authentication.
	 */
	public constructor(
		private readonly credentials: TokenCredential,
		private readonly scopes: string[] = [],
		private readonly options?: GetTokenOptions,
		allowedHosts: Set<string> = new Set<string>(),
		private readonly observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl(),
	) {
		if (!credentials) {
			throw new Error("parameter credentials cannot be null");
		}
		if (!scopes) {
			throw new Error("scopes cannot be null");
		}
		if (!observabilityOptions) {
			throw new Error("observabilityOptions cannot be null");
		}
		this.allowedHostsValidator = new AllowedHostsValidator(allowedHosts);
	}
	private readonly allowedHostsValidator: AllowedHostsValidator;
	private static readonly claimsKey = "claims";
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
	private getAuthorizationTokenInternal = async (url?: string, additionalAuthenticationContext?: Record<string, unknown>, span?: Span): Promise<string> => {
		if (!url || !this.allowedHostsValidator.isUrlHostValid(url)) {
			span?.setAttribute("com.microsoft.kiota.authentication.is_url_valid", false);
			return "";
		}
		validateProtocol(url);
		span?.setAttribute("com.microsoft.kiota.authentication.is_url_valid", true);
		let decodedClaims = "";
		if (additionalAuthenticationContext && additionalAuthenticationContext[AzureIdentityAccessTokenProvider.claimsKey]) {
			const rawClaims = additionalAuthenticationContext[AzureIdentityAccessTokenProvider.claimsKey] as string;
			decodedClaims = inBrowserEnv() ? atob(rawClaims) : Buffer.from(rawClaims, "base64").toString();
		}
		span?.setAttribute("com.microsoft.kiota.authentication.additional_claims_provided", decodedClaims !== "");
		const localOptions = { ...this.options };
		if (decodedClaims) {
			(localOptions as any).claims = decodedClaims; // the field is defined in a derived interface for some reason https://github.com/Azure/azure-sdk-for-js/blob/4498fecbede71563fee5daae2ad537ff57de3640/sdk/identity/identity/src/msal/credentials.ts#L29
		}
		if (this.scopes.length === 0) {
			const [scheme, host] = this.getSchemeAndHostFromUrl(url);
			this.scopes.push(`${scheme}://${host}/.default`);
		}
		span?.setAttribute("com.microsoft.kiota.authentication.scopes", this.scopes.join(","));
		const result = await this.credentials.getToken(this.scopes, localOptions);
		return result?.token ?? "";
	};
	private getSchemeAndHostFromUrl = (url: string): string[] => {
		const urlParts = url.split("://");
		if (urlParts.length === 0) {
			// relative url
			return [this.getSchemeFromLocation(), this.getHostFromLocation()];
		} else if (urlParts.length === 1) {
			// protocol relative url
			return [this.getSchemeFromLocation(), urlParts[0].split("/")[0]];
		} else if (urlParts.length >= 2) {
			// absolute url
			return [urlParts[0], urlParts[1].split("/")[0]];
		} else {
			throw new Error("invalid url");
		}
	};
	private getSchemeFromLocation = (): string => {
		if (window && window.location && window.location.protocol) {
			return window.location.protocol.replace(":", "");
		}
		return "";
	};
	private getHostFromLocation = (): string => {
		if (window && window.location && window.location.host) {
			return window.location.host;
		}
		return "";
	};
	/**
	 * @inheritdoc
	 */
	public getAllowedHostsValidator = () => this.allowedHostsValidator;
}
