# vite.config.ts: Sentry source map upload for a Vercel build

Grounded in [raw/sentry--sourcemaps--vercel-vite-plugin.md], [raw/sentry--sveltekit-sdk--client-server-hooks.md].

## Full config

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		// Source map generation must be turned on for upload to have anything to work with.
		sourcemap: 'hidden'
	},
	plugins: [
		// sentrySvelteKit MUST come before sveltekit() in the plugins array.
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: process.env.SENTRY_ORG,
				project: process.env.SENTRY_PROJECT,
				authToken: process.env.SENTRY_AUTH_TOKEN
			}
		}),
		sveltekit()
	]
});
```

## If wiring the standalone `@sentry/vite-plugin` instead of `sentrySvelteKit`

`sentrySvelteKit()` wraps `@sentry/vite-plugin` plus SvelteKit-specific `load`-function instrumentation. If a project needs the bare plugin (e.g. non-SvelteKit build step in the same repo), the equivalent standalone config is:

```typescript
import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
	build: {
		sourcemap: 'hidden'
	},
	plugins: [
		// Sentry plugin must be ordered AFTER all other plugins, not before -
		// this is the opposite ordering rule from sentrySvelteKit() above, because
		// this plugin needs the final, fully-transformed source maps to upload.
		sentryVitePlugin({
			org: process.env.SENTRY_ORG,
			project: process.env.SENTRY_PROJECT,
			authToken: process.env.SENTRY_AUTH_TOKEN,
			sourcemaps: {
				filesToDeleteAfterUpload: ['./**/*.map', './.svelte-kit/**/*.map']
			}
		})
	]
});
```

Note the ordering rule differs between the two: `sentrySvelteKit()` goes **before** `sveltekit()`, but the standalone `sentryVitePlugin()` goes **after** every other plugin in a generic Vite setup. Do not copy one ordering rule onto the other plugin [raw/sentry--sourcemaps--vercel-vite-plugin.md, raw/sentry--sveltekit-sdk--client-server-hooks.md].

## Auth token sourcing - do not hardcode

`SENTRY_AUTH_TOKEN` must come from an environment variable, never committed to the repo. Three valid sources, in order of preference for a Vercel deployment:

1. **Auto-injected by Sentry's Vercel integration** once project-linking is complete (see `env-var-checklist.md`) - nothing to configure manually.
2. **Manually set as a Vercel project environment variable** (Project Settings > Environment Variables), scoped to Production/Preview as needed, if not using the Vercel integration.
3. A gitignored `.env.sentry-build-plugin` file for local development only - never for CI/production.

## Delete source maps after upload

`filesToDeleteAfterUpload` removes generated `.map` files from the build output after Sentry has ingested them, preventing them from being served publicly (which would leak original source). Set a glob matching wherever SvelteKit's adapter writes client-side map files (path varies by adapter - verify against the actual build output directory rather than assuming a fixed path) [raw/sentry--sourcemaps--vercel-vite-plugin.md].

## The plugin does not run in dev mode

Source maps are only uploaded during a production build (`vite build`), never `vite dev`. Verify the configuration by running an actual production build locally with `SENTRY_AUTH_TOKEN` set, not by trusting the dev server [raw/sentry--sourcemaps--vercel-vite-plugin.md].

## Monorepo caveat

If this SvelteKit app lives inside a monorepo built via Turborepo (or a similar task runner), confirm `SENTRY_AUTH_TOKEN` (and `SENTRY_ORG`/`SENTRY_PROJECT` if also read from env) are explicitly forwarded through the task runner's env-passthrough config. Turborepo v2+ does not forward environment variables to task hashes by default, which is a confirmed, repeatedly-reported cause of "auth token is set in Vercel but the build still says no auth token provided" [raw/sentry--sourcemaps--vercel-vite-plugin.md].
