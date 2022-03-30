import {ApiClient} from "../generatedCode/apiClient";
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary";
import {AzureIdentityAuthenticationProvider} from "@microsoft/kiota-authentication-azure";
import {ClientSecretCredential} from "@azure/identity";

const tokenCredential = new ClientSecretCredential(tenantId,clientid,clientsecret);

const authProvider = new AzureIdentityAuthenticationProvider(tokenCredential);
const fetchRequestAdapter = new FetchRequestAdapter(authProvider)
export const apiClient = new ApiClient(fetchRequestAdapter);



