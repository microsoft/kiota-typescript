/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { AccountInfo, IPublicClientApplication, InteractionType } from "@azure/msal-browser";

/**
 * Configuration options for MSAL Browser authentication
 */
export interface MsalBrowserAuthenticationConfig {
	/**
	 * The PublicClientApplication instance to use for acquiring tokens.
	 */
	clientApplication: IPublicClientApplication;
	/**
	 * The account to use for token acquisition. If undefined, MSAL will use active account or default.
	 */
	account?: AccountInfo;
	/**
	 * The interaction type to use when silent acquisition fails (Silent, Popup, Redirect).
	 * Defaults to InteractionType.Popup.
	 */
	interactionType?: InteractionType;
	/**
	 * The scopes required for authentication.
	 */
	scopes?: string[];
}
