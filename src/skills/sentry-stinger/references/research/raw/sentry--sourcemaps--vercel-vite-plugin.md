# Sentry source map upload via @sentry/vite-plugin, auth tokens, and Vercel build behavior

- URL: https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/ ; https://www.npmjs.com/package/@sentry/vite-plugin ; https://github.com/getsentry/sentry-javascript/issues/13715 ; https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/
- Fetched: 2026-08-14
- Source type: Official docs (docs.sentry.io) + official npm package README + GitHub issue (community-reported, Sentry-engineer-answered)
- Component: Source maps / Vercel build

## Content

### Automatic setup (wizard)

```bash
npx @sentry/wizard@latest -i sourcemaps
```

Wizard handles: login/project selection, installing packages, configuring the build tool, configuring CI to upload source maps.

### Manual install

```bash
npm install @sentry/vite-plugin --save-dev
```

Requires Sentry JS SDK version `7.47.0`+ to upload source maps at all.

### Auth token

To upload source maps, configure an **Organization Auth Token** (preferred) from `Settings > Auth Tokens`, or a **Personal Token** with `Project: Read & Write` + `Release: Admin` scopes.

Token can be supplied three ways:
1. Explicitly via the plugin's `authToken` option.
2. Via `SENTRY_AUTH_TOKEN` environment variable.
3. Via an `.env.sentry-build-plugin` file in the working directory during build (must be gitignored - contains sensitive data).

Recommended: add the auth token to CI/CD as an environment variable (i.e., a Vercel project environment variable), not committed to the repo.

### Vite doesn't auto-load `.env` into `process.env`

Vite does not automatically load `.env` files into `process.env` when evaluating `vite.config.ts` itself. If reading the token via `process.env.SENTRY_AUTH_TOKEN` from a `.env` file, use Vite's `loadEnv` helper:

```javascript
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        // ...
      }),
    ],
  };
});
```

Alternative: an `.env.sentry-build-plugin` file, which the Sentry plugin reads automatically without needing `loadEnv`.

### Plugin ordering matters

Place the Sentry Vite plugin **after all other plugins** in the `plugins` array. This ensures source maps generate correctly and tree-shaking doesn't strip Sentry's own instrumentation.

### Full example config

```javascript
import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  build: {
    sourcemap: "hidden", // must be turned on: "hidden", true, etc.
  },
  plugins: [
    // Sentry plugin last
    sentryVitePlugin({
      org: "<your-org-slug>",
      project: "<your-project-slug>",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        // Delete source maps after upload so they aren't served publicly
        filesToDeleteAfterUpload: [
          "./**/*.map",
          ".*/**/public/**/*.map",
          "./dist/**/client/**/*.map",
        ],
      },
    }),
  ],
});
```

`org` and `project` can also come from `SENTRY_ORG` / `SENTRY_PROJECT` env vars (seen in the `@sentry/vite-plugin` README's own example, which uses `process.env.SENTRY_ORG` / `process.env.SENTRY_PROJECT` directly instead of hardcoded slugs).

Multi-project upload is supported by passing an array to `project`:

```javascript
sentryVitePlugin({
  org: process.env.SENTRY_ORG,
  project: ["frontend-team-a", "frontend-team-b", "frontend-team-c"],
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### Why delete source maps after upload

Generating source maps can expose them publicly, leaking original source code. Mitigate either by configuring the server to deny access to `.js.map` files, or via the plugin's `sourcemaps.filesToDeleteAfterUpload` option (shown above) so maps are removed from the build output after Sentry has ingested them.

### Plugin does not run in dev/watch mode

The Sentry Vite plugin does not upload source maps in watch-mode or development-mode builds. Sentry recommends running a production build to verify the configuration actually works, rather than trusting a dev-server run.

### Known operational failure mode: `SENTRY_AUTH_TOKEN` not available during Vercel/monorepo builds

From a GitHub issue on `getsentry/sentry-javascript` (Next.js-flavored but the underlying bundler-plugin-core logic is shared with the Vite plugin): builds fail with "Warning: No auth token provided. Will not create release... Will not upload source maps" even when `SENTRY_AUTH_TOKEN` is visibly set in the Vercel project's environment variables UI.

Root cause identified by a Sentry engineer (`@lforst`) in the thread: this is almost always a **monorepo task-runner environment variable forwarding problem**, not a Sentry or Vercel bug. Specifically called out: **Turborepo does not forward environment variables to task hashes/build steps by default from v2 onward** - the variable exists in the Vercel project but never reaches the actual build process invoked by Turborepo. Multiple independent commenters confirmed this fixed the issue for them.

Practical implication for a Vercel + monorepo setup: explicitly declare `SENTRY_AUTH_TOKEN` (and `SENTRY_ORG`/`SENTRY_PROJECT` if also read from env) in the task runner's env-passthrough config (e.g., Turborepo's `turbo.json` `globalEnv` / task `env` array) in addition to setting it in Vercel's project settings. For a non-monorepo SvelteKit project this specific failure mode does not apply, but the general lesson - **verify the env var is actually visible inside the build process, not just set in the platform UI** - still holds.

### Where the auth token comes from when using Sentry's own Vercel integration

The Sentry<->Vercel deployment integration (the "Releases and Source Map Integration", separate from the newer Vercel Marketplace integration - see the dedicated Vercel-integration raw file) auto-generates a `SENTRY_AUTH_TOKEN` scoped to a "Vercel Internal Integration" and injects it as a Vercel project environment variable automatically, removing the need to manually create and paste an org auth token. This only fires after the project-linking step is completed and the Vercel project is redeployed.

### Trace of source map upload guides for other bundlers (context, not this skill's focus)

Sentry documents equivalent guides for Webpack, esbuild, Rollup, TypeScript (`tsc`), Ionic, Ionic Capacitor, and the Sentry CLI directly - Vite is the one this skill targets since it is SvelteKit's bundler.

### Rolldown/Vite 6+ timing warning (informational, not actionable config)

Vite 6+ with the Rolldown bundler may surface a `[PLUGIN_TIMINGS]` warning claiming `sentry-vite-plugin` consumes over 50% of build time. This is Rolldown's own plugin-timing check firing because the source-map upload step is a network call, not evidence of a real performance problem - expected behavior, not a bug to chase.
