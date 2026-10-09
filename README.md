# Kiota Libraries for TypeScript

The Kiota libraries define the basic constructs needed by TypeScript and JavaScript clients generated from an OpenAPI definition and provide default implementations for serialization, authentication, and HTTP transport.

A [Kiota](https://github.com/microsoft/kiota) generated project uses these runtime libraries to build and execute API requests in Node.js and browsers.

Read more about Kiota [here](https://github.com/microsoft/kiota/blob/main/README.md).

## Supported runtimes

The libraries support Node.js 22.x, 24.x, and 26.x, as well as browsers. Node.js 20 is no longer supported.

## Build Status

[![Build and test](https://github.com/microsoft/kiota-typescript/actions/workflows/build_test_validate.yml/badge.svg?branch=main)](https://github.com/microsoft/kiota-typescript/actions/workflows/build_test_validate.yml)

## Libraries

| Library | npm Release |
|---------|-------------|
| [Abstractions](./packages/abstractions/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-abstractions?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-abstractions) |
| [Authentication - Azure](./packages/authentication/azure/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-authentication-azure?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-authentication-azure) |
| [Authentication - SharePoint Framework](./packages/authentication/spfx/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-authentication-spfx?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-authentication-spfx) |
| [HTTP - Fetch](./packages/http/fetch/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-http-fetchlibrary?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-http-fetchlibrary) |
| [Serialization - JSON](./packages/serialization/json/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-serialization-json?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-serialization-json) |
| [Serialization - FORM](./packages/serialization/form/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-serialization-form?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-serialization-form) |
| [Serialization - TEXT](./packages/serialization/text/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-serialization-text?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-serialization-text) |
| [Serialization - MULTIPART](./packages/serialization/multipart/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-serialization-multipart?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-serialization-multipart) |
| [Bundle](./packages/bundle/README.md) | [![npm version](https://img.shields.io/npm/v/@microsoft/kiota-bundle?label=Latest&logo=npm)](https://www.npmjs.com/package/@microsoft/kiota-bundle) |

## Getting started

The bundle provides a Fetch-based request adapter with the default serialization libraries configured:

```sh
npm install @microsoft/kiota-bundle
```

Install an authentication library separately if your API requires it. See the individual library READMEs above for installation and usage details.

For client generation and a complete example, see the [Kiota TypeScript quickstart](https://learn.microsoft.com/openapi/kiota/quickstarts/typescript).

## Release notes

Release notes are available in each library's `CHANGELOG.md` alongside its README. Each library is versioned independently.

## Building and testing

This repository is a Lerna monorepo using npm workspaces, with libraries under `packages/`.

Use a supported Node.js version (22.x, 24.x, or 26.x) for local development. CI builds and tests all three versions; coverage and Azure Pipelines use Node.js 26.x.

```sh
# Restore the exact dependencies from the lockfile
npm ci

# Build all libraries
npm run build

# Run Node.js and browser tests
npm test

# Lint
npm run lint
```

To build or run Node.js tests for a single library:

```sh
npx lerna run build --scope @microsoft/kiota-serialization-json
npx lerna run test:node --scope @microsoft/kiota-serialization-json
```

Build dependent libraries before testing a library that uses them.

## Debugging

If you use Visual Studio Code, [`.vscode/launch.json`](./.vscode/launch.json) contains configurations for debugging the current test file and browser tests.

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
