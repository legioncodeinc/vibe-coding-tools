# Vite Environment Variables and Modes
- URL: https://vite.dev/guide/env-and-mode.html
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: upstream build-tool documentation

## Captured source material

```js
import.meta.env.VITE_SOME_KEY
```

The source states: "VITE_* variables should not contain sensitive information such as API keys."

## Archived evidence

Vite exposes selected environment variables through `import.meta.env` and statically replaces them at build time. The default client-exposed prefix is `VITE_`, and `envPrefix` can customize the exposed prefixes.

Vite explicitly warns that client-exposed variables must not contain secrets such as API keys because their values are bundled into frontend source code. It recommends a backend service for protected production secrets.

## Archive interpretation

Any broad custom prefix is part of the frontend secret boundary. Inspect its exact values and scan built assets with safe canaries.
