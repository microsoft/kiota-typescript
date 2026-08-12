# Copilot Instructions for kiota-typescript

## Build, Test, and Lint

This is a Lerna monorepo using npm workspaces. All packages are under `packages/`.

```bash
# Restore the exact dependencies from package-lock.json
npm ci

# Full build (includes prettier check + clean)
npm run build

# Build a single package
npx lerna run build --scope @microsoft/kiota-abstractions

# Run all tests (node + browser)
npm test

# Run node tests for a single package
npx lerna run test:node --scope @microsoft/kiota-serialization-json

# Run a single test file directly
npx vitest run --config packages/abstractions/vite.config.mts test/someFile.ts

# Lint
npm run lint

# Format check / fix
npm run prettier:check
npm run prettier:write
```

Always use `npm ci` to restore the dependencies required by the repository. Do not use `npm install` as a substitute for restoring the existing lockfile.

Package dependencies are local (e.g., `kiota-http-fetchlibrary` depends on `kiota-abstractions`). Build dependent packages first when testing downstream packages.

## Architecture

Kiota is a code generator for OpenAPI-described APIs. This repo provides the **TypeScript/JavaScript runtime libraries** that generated clients depend on.

### Package hierarchy (dependency flows downward)

```
@microsoft/kiota-bundle            (convenience: bundles all defaults)
    ├── kiota-http-fetchlibrary    (RequestAdapter impl using fetch + middleware pipeline)
    ├── kiota-serialization-json   (JSON parse/serialize)
    ├── kiota-serialization-text   (plain text parse/serialize)
    ├── kiota-serialization-form   (form URL-encoded parse/serialize)
    ├── kiota-serialization-multipart (multipart form data)
    └── kiota-abstractions         (core interfaces: RequestAdapter, Parsable, serialization contracts)

@microsoft/kiota-authentication-azure  (Azure Identity-based auth provider)
@microsoft/kiota-authentication-spfx   (SPFx-based auth provider)
```

### Core abstractions pattern

- **`RequestAdapter`** – translates `RequestInformation` into HTTP calls; implemented by `FetchRequestAdapter`
- **`Parsable` / `ParsableFactory`** – interfaces for (de)serializable models; generated code implements these
- **`ParseNode` / `SerializationWriter`** – per-format reader/writer (JSON, text, form, multipart)
- **`ParseNodeFactory` / `SerializationWriterFactory`** – factory pattern for content-type dispatch
- **Backing Store** – optional dirty-tracking layer for models (in `abstractions/src/store/`)
- **Middleware pipeline** – `fetch`-based handler chain (retry, redirect, compression, telemetry, etc.) in `packages/http/fetch/src/middlewares/`

### Dual environment support

All packages target both Node.js and browser. Some packages have `src/browser/` directories with browser-specific implementations. Tests run via `vitest` in both environments (`test:node` and `test:browser` scripts).

## Key Conventions

- **ESM-only** – all packages use `"type": "module"` with ES6 module output
- **License header required** – every `.ts` source file must start with the Microsoft copyright block comment (enforced by eslint `header/header` rule)
- **Prefer arrow functions** – eslint `prefer-arrow/prefer-arrow-functions` is enabled
- **Conventional Commits** – commit messages MUST follow the format: `<type>(optional scope): <description>`. Valid types: `feat`, `fix`, `perf`, `refactor`, `test`, `style`, `docs`, `build`, `ci`, `chore`. Use `feat` for new features (bumps minor), `fix` for bug fixes (bumps patch). Add a `BREAKING CHANGE:` footer to trigger a major version bump. This format is required to support the automated release-please process.
- **Independent versioning** – each package is versioned independently via release-please
- **JSDoc required** – `eslint-plugin-jsdoc/recommended-typescript-error` is enforced on all source
- **TypeScript strict mode** – `strict: true` with all strict sub-options enabled
- **Output directory** – compiled output goes to `dist/es/` via `tsc` + `tsc-alias`
- **No `any`** – `@typescript-eslint/no-explicit-any` is set to warn

## Testing Requirements

- **All code changes must include corresponding test coverage.** If adding a new feature or fixing a bug, add or update tests to cover the change.
- Tests live in `test/` directories alongside the source in each package.
- Use `vitest` as the test framework. Tests should run in both Node.js (`test:node`) and browser (`test:browser`) environments where applicable.
- Run coverage with `npx lerna run test:coverage --scope @microsoft/<package-name>` to verify coverage. Coverage reports use Istanbul.
- When fixing a bug, add a regression test that would have caught the bug before your fix.
