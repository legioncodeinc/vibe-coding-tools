# Vercel Functions: Node.js vs Edge runtime, limits, streaming, failover

- URL: https://vercel.com/docs/functions/runtimes/edge ; https://vercel.com/docs/functions/runtimes ; https://vercel.com/docs/functions/runtimes/node-js ; https://vercel.com/docs/functions/configuring-functions/runtime
- Fetched: 2026-08-14
- Source type: Official Vercel docs
- Component: Vercel Functions / runtimes

## Content

### Official runtimes

Vercel Functions officially support Node.js and Edge. Node.js "takes an entrypoint, builds dependencies, and bundles them into a Vercel Function." Edge "is built on top of the V8 engine, allowing it to run in isolated execution environments that don't require a container or virtual machine." Other languages (Python, Ruby, Go, community runtimes) are configured via the `functions` property in `vercel.json`.

### Vercel's own current guidance: migrate off Edge

As of the 2026-08-03 doc revision, Vercel's Edge Runtime page carries this note: **"We recommend migrating from edge to Node.js for improved performance and reliability. Both runtimes run on Fluid compute with Active CPU pricing."** Also: starting Next.js 16.3, `runtime = 'edge'` is no longer supported for Next.js routes/pages (they run on Node.js). This is a live, in-progress platform shift - treat "Edge by default" advice from older material as stale.

### Node.js runtime characteristics

- Full Node.js API compatibility.
- More RAM/CPU, better suited to computationally heavy or large functions, and to functions that need to exceed Edge's bundle-size limits.
- Supports streaming by default (as does the Python runtime).
- Supports `waitUntil` (from `@vercel/functions` package) for async background work after the response is sent.
- Can run Routing Middleware on Node.js as of the newer middleware model (see routing-middleware raw file) - but this incurs standard Functions pricing, unlike the historically "free" Edge-only middleware model.
- `functionFailoverRegions` (in `vercel.json`) lets Node.js functions specify automatic failover regions; Edge functions get this redundancy automatically.

### Edge runtime characteristics and limits

- Executes in the region closest to the incoming request by default; `regions`/`preferredRegion` can pin it.
- Must begin sending a response within **25 seconds** to keep streaming; can continue streaming for up to **300 seconds** total, and can continue async background work after the response returns.
- No filesystem access; `require()` is disallowed (ESM only); dynamic code execution (`eval` and similar) is disallowed for security; only a subset of Node.js APIs are available (a documented allow-list of `node:`-prefixed modules that work with or without the prefix); most libraries that depend on native Node APIs won't run on Edge.
- Detect at runtime via `globalThis.EdgeRuntime`.
- Non-framework projects must use `"type": "module"` in `package.json` or `.mjs` extensions.

### Configuring runtime explicitly

```ts
// api/runtime-example.ts
export const config = {
  runtime: 'edge', // or omit for Node.js default
  regions: ['iad1', 'hnd1'], // edge-only multi-region example
};
```

Other runtimes (PHP, etc.) go through `vercel.json`:

```json
{
  "functions": {
    "api/test.php": { "runtime": "vercel-php@0.5.2" }
  }
}
```
