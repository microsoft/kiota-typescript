/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { GetTokenOptions, TokenCredential } from "@azure/core-auth";
import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";

import { AzureIdentityAccessTokenProvider } from "./azureIdentityAccessTokenProvider";
import { type ObservabilityOptions, ObservabilityOptionsImpl } from "./observabilityOptions";

export class AzureIdentityAuthenticationProvider extends BaseBearerTokenAuthenticationProvider {
	/**
	 *@constructor
	 *@param credentials The tokenCredential implementation to use for authentication.
	 *@param scopes The scopes to use for authentication.
	 *@param options The options to use for authentication.
	 *@param allowedHosts The allowed hosts to use for authentication.
	 *@param observabilityOptions The observability options to use for authentication.
	 *@param isCaeEnabled A flag to determine if Continuous Access Evaluation is enabled
	 */
	public constructor(credentials: TokenCredential, scopes: string[] = ["https://graph.microsoft.com/.default"], options?: GetTokenOptions, allowedHosts: Set<string> = new Set<string>(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn", "canary.graph.microsoft.com"]), observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl(), isCaeEnabled = true) {
		super(new AzureIdentityAccessTokenProvider(credentials, scopes, options, allowedHosts, observabilityOptions, isCaeEnabled));
	}
}
