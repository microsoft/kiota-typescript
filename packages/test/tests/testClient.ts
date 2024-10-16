/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { FetchRequestAdapter } from "@microsoft/kiota-http-fetchlibrary";
import { AzureIdentityAuthenticationProvider } from "@microsoft/kiota-authentication-azure";
import { ClientSecretCredential } from "@azure/identity";
import { createApiClient } from "../generatedCode/apiClient";

const tokenCredential = new ClientSecretCredential(process.env.TENANT_ID!, process.env.CLIENT_ID!, process.env.CLIENT_SECRET!);

const authProvider = new AzureIdentityAuthenticationProvider(tokenCredential, ["https://graph.microsoft.com/.default"]);
const fetchRequestAdapter = new FetchRequestAdapter(authProvider);
export const proxyClient = createApiClient(fetchRequestAdapter);
export const userId = process.env.USER_ID!;
