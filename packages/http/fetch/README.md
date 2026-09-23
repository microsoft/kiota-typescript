# Microsoft Kiota HTTP - Fetch  library

[![npm version badge](https://img.shields.io/npm/v/@microsoft/kiota-http-fetchlibrary?color=blue)](https://www.npmjs.com/package/@microsoft/kiota-http-fetchlibrary)

The Kiota Http Fetch Library is an implementation using the Fetch API to make requests.

A [Kiota](https://github.com/microsoft/kiota) generated project will need a reference to an HTTP implementation to make calls to an API endpoint.

Read more about Kiota [here](https://github.com/microsoft/kiota/blob/main/README.md).

## Using the Kiota Fetch library implementations

1. `npm i @microsoft/kiota-http-fetchlibrary @microsoft/kiota-bundle @microsoft/kiota-abstractions`.

## Send cookies with a custom fetch function

To send cookies to an API from a browser, configure a custom fetch function with `credentials: "include"` and pass it to `KiotaClientFactory.create()`. Use the resulting HTTP client when constructing your request adapter:

```typescript
import { AnonymousAuthenticationProvider } from "@microsoft/kiota-abstractions";
import { DefaultRequestAdapter } from "@microsoft/kiota-bundle";
import { KiotaClientFactory } from "@microsoft/kiota-http-fetchlibrary";

const customFetch = (url: string, init: RequestInit) =>
	fetch(url, { ...init, credentials: "include" });

const httpClient = KiotaClientFactory.create(customFetch);
const authProvider = new AnonymousAuthenticationProvider();
const adapter = new DefaultRequestAdapter(authProvider, undefined, undefined, httpClient);
```

Use your API's authentication provider in place of `AnonymousAuthenticationProvider` when the API requires one. In browsers, cross-origin cookie requests also require the API to allow credentialed CORS requests and the cookies to have compatible attributes.

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
