import {ApiClient} from "../generatedCode/apiClient";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";
import {AzureIdentityAuthenticationProvider} from "@microsoft/kiota-authentication-azure";
import {ClientSecretCredential} from "@azure/identity";

const tokenCredential = new ClientSecretCredential(process.env.TENANT_ID!, process.env.CLIENT_ID!, process.env.CLIENT_SECRET! );

const authProvider = new AzureIdentityAuthenticationProvider(tokenCredential, ["https://graph.microsoft.com/.default"]);
const fetchRequestAdapter = new FetchRequestAdapter(authProvider)
export const apiClient = new ApiClient(fetchRequestAdapter);

