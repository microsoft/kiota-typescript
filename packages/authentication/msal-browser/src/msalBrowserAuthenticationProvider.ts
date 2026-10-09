/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";

import { MsalBrowserAccessTokenProvider } from "./msalBrowserAccessTokenProvider";
import { type MsalBrowserAuthenticationConfig } from "./msalBrowserAuthenticationConfig";
import { type ObservabilityOptions, ObservabilityOptionsImpl } from "./observabilityOptions";

/** Authentication provider leveraging MSAL Browser for Kiota clients. */
export class MsalBrowserAuthenticationProvider extends BaseBearerTokenAuthenticationProvider {
	/**
	 * @param config The MSAL Browser authentication configuration.
	 * @param allowedHosts The allowed hosts to use for authentication.
	 * @param observabilityOptions The observability options to use.
	 */
	public constructor(config: MsalBrowserAuthenticationConfig, allowedHosts: Set<string> = new Set<string>(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn", "canary.graph.microsoft.com"]), observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl()) {
		super(new MsalBrowserAccessTokenProvider(config, allowedHosts, observabilityOptions));
	}
}
