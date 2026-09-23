# Microsoft Kiota HTTP - Fetch  library

[![npm version badge](https://img.shields.io/npm/v/@microsoft/kiota-http-fetchlibrary?color=blue)](https://www.npmjs.com/package/@microsoft/kiota-http-fetchlibrary)

The Kiota Http Fetch Library is an implementation using the Fetch API to make requests.

A [Kiota](https://github.com/microsoft/kiota) generated project will need a reference to an HTTP implementation to make calls to an API endpoint.

Read more about Kiota [here](https://github.com/microsoft/kiota/blob/main/README.md).

## Using the Kiota Fetch library implementations

1. `npm i @microsoft/kiota-http-fetchlibrary`.

## Body Inspection Handler

The `BodyInspectionHandler` middleware allows you to inspect HTTP request and response bodies. This is particularly useful for debugging or capturing error payloads that are not mapped in the API schema.

The handler is included in the default middleware pipeline configured by `KiotaClientFactory.create()`.

### Configuration

Body inspection is opt-in and controlled via `BodyInspectionOptions`. You can configure it globally on the handler or per-request by passing `BodyInspectionOptions` in the request options.

```typescript
import { BodyInspectionOptions } from "@microsoft/kiota-http-fetchlibrary";

const bodyInspectionOptions = new BodyInspectionOptions({
	inspectRequestBody: true,
	inspectResponseBody: true,
});

// Pass per request using request configuration:
await client.users.get({
	options: [bodyInspectionOptions],
});

// Access the inspected body as an ArrayBuffer:
const responseBuffer = bodyInspectionOptions.responseBody;
```

### Memory and Stream-Lifecycle Considerations

- **Memory / Buffering**: Inspecting request and response bodies creates in-memory copies (`ArrayBuffer`). For large payloads or file transfers, buffering the entire body into memory increases heap usage. Only enable inspection when necessary.
- **Stream Lifecycle**: In JavaScript and browser fetch implementations, `ReadableStream` instances are single-use and can only be consumed once.
  - Web `ReadableStream` and Node.js readable request bodies are buffered once and replaced with replayable bytes before the request continues downstream. This consumes the original stream so a permitted retry can reuse the inspected request body. Retry eligibility is still controlled by `RetryHandler`; for example, it does not retry `application/octet-stream` POST, PUT, or PATCH requests.
  - In the performance middleware pipeline, stream buffering requires `inspectRequestBody: true`. Compression does not accept an uninspected stream body.
  - The captured request and response bodies are exposed as `ArrayBuffer` values. Callers that need another representation can construct it explicitly from those bytes.
- **Concurrent requests**: Use a separate request-scoped `BodyInspectionOptions` instance for each request whose captured body you need to read. A handler's global options instance is shared across requests.

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
