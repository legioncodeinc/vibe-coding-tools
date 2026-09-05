# vercel.json reference + Build Output API (deployment model foundation)

- URL: https://vercel.com/docs/project-configuration/vercel-json ; https://vercel.com/docs/project-configuration/ ; https://vercel.com/docs/build-output-api ; https://vercel.com/docs/build-output-api/configuration
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Project configuration / Build Output API

## Content

### vercel.json - full property list

Lives at project root, version-controlled. Enable schema autocomplete/validation with:

```json
{ "$schema": "https://openapi.vercel.sh/vercel.json" }
```

Supported top-level properties: `buildCommand`, `bunVersion`, `cleanUrls`, `crons`, `devCommand`, `fluid`, `framework`, `functions`, `headers`, `ignoreCommand`, `images`, `installCommand`, `outputDirectory`, `redirects`, `bulkRedirectsPath`, `regions`, `functionFailoverRegions`, `rewrites`, `routes`, `trailingSlash`.

An equivalent programmatic config file, `vercel.ts`, supports the same property set but runs at build time - useful for generating config dynamically from env vars or API calls. Only one config file (`vercel.json` OR `vercel.ts`) is used per project.

Relevant properties for a SvelteKit+Neon+Vercel stack:
- `functions`: configure memory/duration/runtime per function path (also how non-Node/Edge community runtimes like `vercel-php@x` get declared).
- `crons`: schedule Vercel Functions (see cron-jobs raw file).
- `images`: configure Vercel's native Image Optimization API (sizes, formats, domains, remotePatterns) at the project-config level - this is the same shape `adapter-vercel`'s `images` option maps to.
- `regions` / `functionFailoverRegions`: pin or fail over Node.js function execution regions.
- `headers` / `redirects` / `rewrites` / `routes`: standard static routing config; `routes` is a lower-level, more powerful superset - the docs note "routes vs. higher-level properties" as an explicit tradeoff (use `headers`/`redirects`/`rewrites` unless you need `routes`'s power).
- `fluid`: toggles Fluid compute for functions project-wide.

### Build Output API (`.vercel/output/`)

A file-system-based spec for a directory structure that *is* a Vercel deployment - this is what `adapter-vercel` (and every other framework adapter) actually emits. Primarily documented for framework authors, but directly useful for understanding what a `vercel build` output looks like and for advanced/non-framework projects that want Vercel platform features (Functions, Routing, Caching, native image optimization) without a supported framework preset.

`config.json` (Build Output config, distinct from `vercel.json`) supported keys:

```ts
type Config = {
  version: 3;
  routes?: Route[];        // same syntax as vercel.json's routes
  images?: ImagesConfig;
  wildcard?: WildcardConfig;
  overrides?: OverrideConfig;
  cache?: string[];
  framework?: Framework;   // display-only metadata
  crons?: CronsConfig;
  services?: Service[];
};
```

`version` must be `3` (current spec version). `routes` reuses `vercel.json`'s route syntax. `images` maps to the Image Optimization API. `services` (newer addition) points to `.vercel/output/services/<name>` for multi-service build outputs.

### Known limitation: native dependencies

Building locally compiles native deps against the local machine's architecture, which won't necessarily match Vercel's production build environment. Vercel's guidance: build on Linux x64 to match the platform Build Image if the project has native binary dependencies.
