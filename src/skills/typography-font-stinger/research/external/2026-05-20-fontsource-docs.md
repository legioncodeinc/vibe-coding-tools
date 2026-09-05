---
source_type: docs
authority: high
relevance: high
topic: Fontsource npm self-hosting
url: https://fontsource.org/docs/getting-started
retrieved: 2026-05-20
---

# Fontsource - Self-Host Open Source Fonts via NPM

## Summary

Fontsource is a collection of 2,000+ open-source fonts packaged as individual NPM packages for self-hosting. It addresses the performance, privacy, version-locking, and offline use cases of Google Fonts CDN while keeping fonts as dependency-managed assets. In 2026 it supports variable fonts via the `@fontsource-variable` package prefix.

## Key quotations / statistics

- "Self-hosting fonts can significantly improve website performance by eliminating the extra latency caused by additional DNS resolution and TCP connection establishment that is required when using a CDN like Google Fonts."
- "Google often pushes updates to their fonts without notice, which may interfere with your live production projects. Manage your fonts like any other NPM dependency." (version-locking benefit)
- "Google does track the usage of their fonts and for those who are extremely privacy concerned, self-hosting is an alternative." (GDPR / privacy benefit)
- "Fontsource highly recommends using variable fonts, especially when working with multiple weights, as it helps reduce bundle sizes."
- 2,082 font families available via Fontsource as of May 2026.

## Installation pattern

```sh
# Static font
npm install @fontsource/inter

# Variable font (recommended)
npm install @fontsource-variable/inter
```

## Import patterns

```js
// Default weight 400
import "@fontsource/inter";

// Specific weight
import "@fontsource/inter/500.css";

// Specific weight + style
import "@fontsource/inter/600-italic.css";
```

## Key gotcha: TypeScript + noUncheckedSideEffects

If TypeScript raises errors on CSS imports, add ambient declarations:
```ts
// globals.d.ts
declare module "*.css";
declare module "@fontsource/*" {}
declare module "@fontsource-variable/*" {}
```

## Variable fonts via @fontsource-variable

The `@fontsource-variable` scope provides variable font packages. A single import enables the full weight axis range without multiple file downloads. See the companion research note on manual `@font-face` rules for the optimization of selecting only the Latin subset.

## Manual @font-face vs. default import

Default imports include ALL Unicode subsets (latin, latin-ext, vietnamese, etc.). For an English-only site, this registers ~12 `@font-face` rules when only 3 are needed. Roy Portas's 2026 article (see `2026-05-20-fontsource-manual-fontface.md`) documents the optimization of writing manual `@font-face` rules that use only the `archivo-latin-wght-normal.woff2` file from the Fontsource package.

## Fontsource vs. next/font comparison

| Aspect | Fontsource | next/font |
|---|---|---|
| Framework | Framework-agnostic | Next.js only |
| Subsetting | Manual (per-import) | Automatic at build |
| Preloading | Manual | Automatic |
| Fallback metrics | Manual | Automatic (size-adjust) |
| CLS prevention | Manual | Automatic |
| Privacy | Self-hosted (good) | Self-hosted (good) |
| Setup complexity | Low | Lower (for Next.js) |

## Annotations for stinger-forge

- This is the primary source for `guides/01-hosting-strategy.md`, Fontsource section.
- The comparison table above should be included in the hosting strategy decision tree.
- For Next.js projects: `next/font` is the simpler path with automatic subsetting and CLS prevention. Fontsource is preferred for non-Next.js React apps, Vite projects, and framework-agnostic codebases.
- The `@fontsource-variable` scope is the 2026 standard for variable fonts via NPM - stinger-forge should document this in the variable fonts guide.
- The manual @font-face optimization (select only latin subset file) is a production-grade technique worth documenting as an advanced pattern.
