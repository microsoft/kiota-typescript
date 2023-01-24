import { InteractiveBrowserCredential } from '@azure/identity';
import { AzureIdentityAuthenticationProvider } from '@microsoft/kiota-authentication-azure';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { ApiClient } from 'test-kiota-typescript-libraries/lib/sdk/es/generatedCode/apiClient';


const clientId = 'YOUR_CLIENT_ID';

// The auth provider will only authorize requests to
// the allowed hosts, in this case Microsoft Graph
const allowedHosts = new Set<string>([ 'graph.microsoft.com' ]);
const graphScopes = [ 'User.Read' ];

const credential = new InteractiveBrowserCredential({
  clientId: clientId,
});

const authProvider =
  new AzureIdentityAuthenticationProvider(credential, graphScopes, undefined, allowedHosts);
const adapter = new FetchRequestAdapter(authProvider);

const client = new ApiClient(adapter);

client.me.get().then((user) => {
    const contentNode = document.getElementById('content');
    if (user && contentNode) {
        contentNode.innerText = user.displayName
            ? `${user.displayName} has signed in`
            : `${user.userPrincipalName} has signed in`;
    } else {
        console.error('No user returned');
    }
});