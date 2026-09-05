# Guide 1: Adapter setup and runtime choice

Grounded in `references/research/distilled-vercel.md` §1-2, `references/research/raw/vercel--sveltekit--adapter-vercel-config.md`, `references/research/raw/vercel--functions--runtimes-node-edge.md`.

## When to walk this guide

First-time Vercel deployment setup for a SvelteKit app, or auditing an existing `svelte.config.js` for correctness.

## Steps

1. **Install the adapter explicitly.** Don't rely on `adapter-auto`. `npm i -D @sveltejs/adapter-vercel`. Pins version stability, speeds CI slightly, and is required to unlock per-route deployment config - `adapter-auto` takes zero options.
2. **Default to Node.js runtime, not Edge.** Vercel's own current docs (last updated 2026-08-03) recommend migrating off Edge for "improved performance and reliability," and Next.js already dropped Edge route support in 16.3. Set `runtime: 'nodejs22.x'` (or `'nodejs20.x'` if the project targets an older LTS) in the adapter config. Reach for Edge only on a specific route with a real sub-25ms global-latency requirement and no Node API dependency - and confirm that requirement is real, not assumed.
3. **Set the config file up per `references/svelte-config-templates.md`.** Remember `svelte.config.js` cannot be TypeScript - this is a hard SvelteKit constraint, not a Vercel one.
4. **Decide regions.** Default single-region (`iad1`) unless there's a specific latency requirement. Multi-region serverless functions require Enterprise; multi-region Edge functions (`regions: 'all'`) work on any plan - this asymmetry matters if a "just use Edge for multi-region" suggestion comes up; weigh it against the runtime recommendation in step 2.
5. **Set per-route overrides only where needed.** Export `config` from `+server.js`/`+page(.server).js`/`+layout(.server).js` for routes needing more memory (`memory`, up to 3008 MB on Pro/Enterprise), longer duration (`maxDuration`), or isolation from the rest of the app (`split: true`). Layout-level config cascades to children unless a child overrides it more specifically - check for accidental inheritance before debugging a mysterious timeout.
6. **Understand what the adapter actually emits.** `.vercel/output/` (Build Output API, config version 3) is the real deployment artifact. If something behaves unexpectedly post-deploy and the `svelte.config.js` looks right, the Build Output API reference (`references/research/raw/vercel--project-configuration--vercel-json-and-build-output-api.md`) is the next place to check, not a guess.

## Common mistakes

- Leaving `adapter-auto` in place for a production app and being unable to set `runtime`/`regions`/`memory` at all.
- Defaulting new routes to Edge out of habit from older tutorials - check distilled §1 conflict flag before doing this.
- Forgetting layout-level `config` cascades and fighting a route override that a parent layout is silently re-applying.
