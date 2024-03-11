## Testing for node and browser
Testing is done using [vitest](https://vitest.dev). The configuration is set to run from the root folder([workspace mode](https://vitest.dev/guide/workspace.html)) as well as the root of every project folder in `packages`. Each project has been configured to allow running the tests in either the node or the browser environment. When you run the workspace test using the script command `test` from the root of the project folder, both node and browser environment tests are run in each of the project folders in `packages`.

### Testing for node

All the tests in the project's `test/*` folder can be run in a node environment using the script command `test:node`. Any browser related code will fail this test run.

### Testing for browser

All the tests in the project's `test/*` folder can be run in a browser environment using the script command `test:browser`. Any node related code will fail this test run.
