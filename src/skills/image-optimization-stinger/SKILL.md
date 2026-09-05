---
name: "image-optimization-stinger"
description: "Image optimization specialist for React/Next.js and HTML contexts: AVIF/WebP format selection (AVIF is the 2026 production default), responsive srcset/sizes calculus, blur placeholders (LQIP via Sharp, BlurHash-as-CSS-gradient, ThumbHash), next/image remote patterns and the Next.js 16 priority→preload shift, and CLI tooling (Sharp Node API, Squoosh CLI for one-offs). Use when the user says \\\\\\\"optimize my images\\\\\\\", \\\\\\\"convert to AVIF\\\\\\\", \\\\\\\"set up srcset\\\\\\\", \\\\\\\"add blur placeholders\\\\\\\", \\\\\\\"next/image remote patterns\\\\\\\", \\\\\\\"LCP image is slow\\\\\\\", \\\\\\\"fix layout shift from images\\\\\\\", \\\\\\\"AVIF vs WebP\\\\\\\", or when auditing a codebase for unoptimized image delivery. Do NOT use for SVG icon systems (icon-system-worker-bee), general Lighthouse audits beyond image-specific findings (lighthouse-pagespeed-worker-bee), CDN/caching architecture beyond image Cache-Control (devops-worker-bee), or CSS animation performance (ux-ui-svelte-worker-bee)."
license: MIT
---

# Image Optimization Stinger

The `image-optimization-stinger` encodes the complete 2026 image delivery playbook: format selection, responsive delivery, placeholder strategies, framework integration, and tooling. Its primary audience is React/Next.js developers shipping web products where images are a material fraction of page weight and LCP candidates.

**The non-negotiables (detailed in `guides/00-principles.md`):**
1. AVIF first, WebP fallback: never JPEG as primary for new raster content.
2. `width` + `height` always: missing dimensions cause CLS.
3. LCP images get `priority` (Next.js <16) or `preload` (Next.js 16+) / `fetchpriority="high"` (native): never `loading="lazy"`.
4. `sizes` must match the CSS layout: the default `100vw` is wrong for most components.
5. Placeholders must be chosen deliberately: LQIP via Sharp is the default; BlurHash/ThumbHash for color-faithful scenarios.

---

## When to use this skill

**Trigger on:**
- "optimize my images" / "convert to AVIF" / "switch to AVIF"
- "set up srcset and sizes" / "responsive images"
- "add blur placeholders" / "BlurHash" / "LQIP" / "ThumbHash"
- "next/image remote patterns" / "next/image config" / "Image component"
- "my LCP image is slow" / "images causing layout shift" / "CLS from images"
- "AVIF vs WebP" / "which image format should I use"
- "audit our images" / "image optimization report"
- "Squoosh" / "Sharp" / "ImageOptim" (in web context)

**Do NOT trigger on:**
- SVG icon library selection → `icon-system-worker-bee`
- Lighthouse score interpretation / CWV remediation beyond images → `lighthouse-pagespeed-worker-bee`
- CDN cache TTL / Cache-Control strategy → `devops-worker-bee`
- CI build pipelines beyond per-image squash → `devops-worker-bee`

---

## Quick-reference decision table

| Scenario | Recommendation |
|---|---|
| New raster content (photo, hero, product) | AVIF primary, WebP fallback, `<picture>` or `next/image` |
| Transparency needed | WebP (or PNG for lossless): AVIF supports alpha but WebP encodes faster |
| Simple logo / diagram | SVG preferred; PNG fallback if SVG not available |
| LCP image above the fold | `priority` (Next.js <16) / `preload` (Next.js 16+) / `fetchpriority="high"` (HTML) |
| Image below the fold | `loading="lazy"` (HTML) / default lazy in `next/image` |
| Placeholder: simplest | LQIP via Sharp (16px WebP + CSS `filter: blur`) |
| Placeholder: color-faithful no-JS | BlurHash as CSS gradient via `@unpic/placeholder` |
| Placeholder: alpha channel support | ThumbHash |
| Next.js with Vercel hosting | `next/image` with `formats: ['image/avif', 'image/webp']` in `next.config` |
| Teams on Cloudflare / Imgix / Fastly CDN | Enable CDN-level format negotiation: no code changes needed |

---

## Guide map

Read guides in order for a full orientation. Jump directly to the relevant guide for targeted work.

- `guides/00-principles.md`: The five non-negotiables and why they exist. Read first on every invocation.
- `guides/01-format-selection.md`: AVIF vs WebP vs JPEG vs PNG vs SVG decision tree; 2026 browser support matrix; CDN-level negotiation.
- `guides/02-srcset-sizes.md`: How to calculate `srcset` variant sets and correct `sizes` values; the 100vw fallacy; art direction with `<picture>`.
- `guides/03-placeholders.md`: LQIP via Sharp, BlurHash-as-CSS-gradient, ThumbHash, solid-color from dominant palette. Tradeoff matrix.
- `guides/04-next-image.md`: `next/image` API, remote patterns config, `priority` vs `preload` (Next.js 16+), custom loaders, `fill` vs responsive vs fixed.
- `guides/05-tooling.md`: Sharp Node API (primary), Squoosh CLI (one-offs), ImageOptim (macOS lossless), and build pipeline integration.

---

## Example map

- `examples/nextjs-avif-with-lqip.md`: Happy path: Next.js `<Image>` with AVIF/WebP formats, correct `sizes`, LQIP blur placeholder, and LCP priority.
- `examples/html-picture-srcset-art-direction.md`: Edge case: native `<picture>` + `<source>` for art-direction responsive images in a non-Next.js context.

---

## Template

- `templates/image-audit-report.md`: The report stub the Bee fills in per audit run. Sections: inventory, format breakdown, srcset/sizes audit, placeholder audit, LCP candidates, remediation checklist.

---

## Research trail

Populated by `scripture-historian` on 2026-05-20 (normal depth, 6-month window, 32 source files).

- `research/research-summary.md`: executive summary, 5 most influential sources, 5 open questions.
- `research/index.md`: full manifest of all 32 source files.
- `research/external/`: 32 source notes from official docs, practitioner blogs, GitHub READMEs, and specs.

Key sources: caniuse.com/avif (browser support), Mux blog (LQIP/BlurHash tradeoff), Next.js official docs (next/image API + Next.js 16 changes), web.dev/articles/optimize-lcp (LCP priority framing), krunkit.me (DPR-aware srcset algorithm).

---

*Paired with: [`../../agents/image-optimization-worker-bee.md`](../../agents/image-optimization-worker-bee.md)*
*Command Brief: [`ai-tools/command-briefs/image-optimization-command-brief.md`](../../command-briefs/image-optimization-command-brief.md)*
