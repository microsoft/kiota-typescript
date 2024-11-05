# Microsoft Kiota Authentication SharePoint Library for TypeScript

[![npm version badge](https://img.shields.io/npm/v/@microsoft/kiota-authentication-spfx?color=blue)](https://www.npmjs.com/package/@microsoft/kiota-authentication-spfx)

The Kiota Authentication SharePoint Framework Library is an implementation to authenticate HTTP requests in SharePoint Framework solutions. This Authentication library, re uses some infrastructure from the SPFx context to obtain a valid token for the required API.

It also works for consuming Microsoft Graph, as it is just another Azure Active Directory protected API.

A [Kiota](https://github.com/microsoft/kiota) generated project will need a reference to an authentication provider to make calls to an API endpoint.

Read more about Kiota [here](https://microsoft.github.io/kiota).

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

If you have generated a Kiota client for Microsoft Graph, you can also use this Auth provider in a similar way:

```ts
    this.props.aadTokenProviderFactory.getTokenProvider()
      .then((tokenProvider: AadTokenProvider): void => {

        const authProvider =
          new AzureAdSpfxAuthenticationProvider(
            tokenProvider);
        
        const adapter = new FetchRequestAdapter(authProvider);
        
        const meClient = new GraphMeServiceClient(adapter);

        meClient.me.get().then(teams => {
          // deal with returned data
        })
        .catch(e => {console.log(e)});
      })
      .catch(e => {console.log(e)});
```

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
