[![npm version badge](https://img.shields.io/npm/v/@microsoft/kiota-authentication-spfx?color=blue)](https://www.npmjs.com/package/@microsoft/kiota-authentication-spfx)

The Kiota Authentication SharePoint Framework Library is an implementation to authenticate HTTP requests in SharePoint Framework solutions. This Authentication library, re uses some infrastructure from the SPFx context to obtain a valid token for the required API.

It also works for consuming Microsoft Graph, as it is just another Azure Active Directory protected API.

A [Kiota](https://github.com/microsoft/kiota) generated project will need a reference to an authentication provider to make calls to an API endpoint.

Read more about Kiota [here](https://github.com/microsoft/kiota/blob/main/README.md).

## Using the Kiota Authentication SPFx

1. `npm i @microsoft/kiota-authentication-spfx -S`.

Then, you use the _aadTokenProviderFactory_ provided by the SPFx context, to get an _AadTokenProvider_ and use it to build the Kiota SPFx AuthProvider.

```ts
this.props.aadTokenProviderFactory.getTokenProvider()
      .then((tokenProvider: AadTokenProvider): void => {

        const authProvider =
          new AzureAdSpfxAuthenticationProvider(
            tokenProvider, 
            "{AZURE_AD_APPLICATION_ID_URI}",
            new Set<string>([
              "mycustomapi.azurewebsites.net",              
            ]));
        
        const adapter = new FetchRequestAdapter(authProvider);
        
        const myCustomApiClient = new MyCustomApiKiotaClient(adapter);

        myCustomApiClient.teams.get().then(teams => {
            // deal with returned data
        })
        .catch(e => {console.log(e)});
      })
      .catch(e => {console.log(e)});
```

If you have generated a Kiota client for MS Graph API, you can also use this Auth provider in a similar way:

```ts
    this.props.aadTokenProviderFactory.getTokenProvider()
      .then((tokenProvider: AadTokenProvider): void => {

        const authProvider =
          new AzureAdSpfxAuthenticationProvider(
            tokenProvider, 
            "https://graph.microsoft.com");
        
        const adapter = new FetchRequestAdapter(authProvider);
        
        const meClient = new GraphMeServiceClient(adapter);

        meClient.me.get().then(teams => {
          // deal with returned data
        })
        .catch(e => {console.log(e)});
      })
      .catch(e => {console.log(e)});
```