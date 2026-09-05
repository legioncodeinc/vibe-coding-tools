# Open-sourcing our progress on Tailwind CSS v4.0 (the Oxide engine alpha announcement)
- URL: https://tailwindcss.com/blog/tailwindcss-v4-alpha
- Fetched: 2026-08-14
- Source type: official docs (Tailwind Labs blog)
- Component: performance

Published: 2024-03-06.

"Last summer at Tailwind Connect I shared a preview of Oxide, a new high-performance engine for Tailwind CSS ... designed to simplify the developer experience and take advantage of how the web platform has evolved in recent years."

The new engine was originally slated as a v3.x release, but the scope of change was judged to constitute a new generation of the framework, hence v4.0.

## A new engine, built for speed

The new engine is a ground-up rewrite. Reported benchmarks at alpha stage:

- Up to 10x faster: a full build of the Tailwind CSS website in 105ms instead of 960ms; the Catalyst UI kit in 55ms instead of 341ms.
- Smaller footprint: the new engine is over 35% smaller installed, even including heavier native packages (Rust parts, Lightning CSS).
- Rust where it counts: the most expensive and parallelizable parts of the framework moved to Rust, while the core framework logic stays in TypeScript for extensibility.
- One dependency: the new engine's only dependency is Lightning CSS.
- Custom parser: a purpose-built CSS parser and data structures, over 2x as fast for parsing as the previous PostCSS-based pipeline.

Explicit framing from the source: "We put an enormous amount of value in backwards compatibility, and that's where the bulk of the work lies before we can tag a stable v4.0 release."

## Lightning CSS role (community explainer)
- URL: https://blog.logrocket.com/exploring-tailwind-oxide/
- Fetched: 2026-08-14
- Source type: blog (community)
- Component: performance

Lightning CSS is a Rust-based CSS transformation tool powering the Oxide engine, replacing the PostCSS/Autoprefixer plugin chain. It uses multi-threading and parallelization for fast minification. Automatic content detection ("Oxide's automatic content detection") replaces the v3 `content` config array by scanning project files directly in Rust rather than Node, taking advantage of parallelization.

## Independent build benchmark (community, large real project)
- URL: https://akousa.net/blog/tailwind-css-v4
- Fetched: 2026-08-14
- Source type: blog (community, independent benchmark)
- Component: performance

Benchmarked against a Next.js app with 847 components, 142 pages, ~23,000 Tailwind class usages:

| Metric | v3 (Node) | v4 (Oxide) | Improvement |
| --- | --- | --- | --- |
| Initial build | 4,280ms | 387ms | 11x |
| Incremental (edit 1 file) | 340ms | 18ms | 19x |
| Full rebuild (clean) | 5,100ms | 510ms | 10x |
| Dev server start | 3,200ms | 290ms | 11x |

Memory and output size on the same project:

| Metric | v3 | v4 |
| --- | --- | --- |
| Peak memory (build) | 380MB | 45MB |
| Steady-state (dev) | 210MB | 28MB |
| CSS output (gzipped) | 34.2 KB | 29.8 KB |

Why it's faster, per this source: (1) native Rust parser/codegen instead of V8-executed JS for genuinely CPU-bound work; (2) no PostCSS in the hot path, Tailwind v4 parses source-to-output directly (PostCSS is still supported for compatibility but skipped on the primary path); (3) fine-grained incremental caching that only re-scans and regenerates for the file that changed.

Gap: this benchmark is a single third-party blog's methodology on one project; treat the specific multipliers (11x, 19x) as illustrative rather than a guaranteed number, and prefer the official 3.78x/8.8x/182x figures from the v4.0 release notes [09-v4-release-notes-performance-features.md] as the citable baseline.

## Independent benchmark, second source
- URL: https://www.codewithseb.com/blog/tailwind-css-4-whats-new-migration-guide
- Fetched: 2026-08-14
- Source type: blog (community)
- Component: performance

| Metric | v3 | v4 | Improvement |
| --- | --- | --- | --- |
| Full build | 378ms | 100ms | 3.8x faster |
| Incremental build | 44ms | 5ms | 8.8x faster |
| Hot reload | Noticeable | Instant | ~100x faster |

Note: this source's numbers match the official release-notes benchmark in [09-v4-release-notes-performance-features.md] almost exactly (378ms/100ms/44ms/5ms), suggesting it is citing the same official Catalyst benchmark rather than an independent run.
