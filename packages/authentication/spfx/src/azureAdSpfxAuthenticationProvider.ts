/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";
import { type AadTokenProvider } from "@microsoft/sp-http";

import { AzureAdSpfxAccessTokenProvider } from "./azureAdSpfxAccessTokenProvider";
import { type ObservabilityOptions, ObservabilityOptionsImpl } from "./observabilityOptions";

export class AzureAdSpfxAuthenticationProvider extends BaseBearerTokenAuthenticationProvider {
	/**
	 *@param tokenProvider The tokenProvider provided by the SharePoint framework
	 *@param applicationIdUri The application ID URI of the Azure AD App that we want to Authenticate
	 *@param allowedHosts The allowed hosts to use for authentication.
	 *@param useCachedToken Allows the developer to specify if cached tokens should be returned.
	 *@param observabilityOptions The observability options to use.
	 */
	public constructor(tokenProvider: AadTokenProvider, applicationIdUri: string, allowedHosts: Set<string> = new Set<string>(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn", "canary.graph.microsoft.com"]), useCachedToken?: boolean, observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl()) {
		super(new AzureAdSpfxAccessTokenProvider(tokenProvider, applicationIdUri, allowedHosts, useCachedToken, observabilityOptions));
	}
}
