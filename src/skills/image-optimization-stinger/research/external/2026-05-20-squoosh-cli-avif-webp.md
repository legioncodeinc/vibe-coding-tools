---
source_type: docs
authority: high
relevance: high
topic: Squoosh CLI usage AVIF WebP batch conversion
url: https://www.npmjs.com/package/@squoosh/cli
date_accessed: 2026-05-20
---

# @squoosh/cli: Official NPM Docs

## Key Findings

- Squoosh CLI is "experimental" by its own docs but widely used for build-time static asset conversion
- Uses WebAssembly codecs (same as the squoosh.app browser tool)
- Worker pool for parallelized processing
- Available via `npx @squoosh/cli` (no install) or `npm i -g @squoosh/cli`
- AVIF encoding config key is `cqLevel` (quality level), not `quality`
- Auto optimizer (`auto`) does NOT reliably work with `--avif` (known limitation)

## CLI Interface

```bash
# Basic usage
npx @squoosh/cli --webp '{"quality":75}' *.jpg -d ./dist/
npx @squoosh/cli --avif '{"cqLevel":33}' *.jpg -d ./dist/
npx @squoosh/cli --avif '{"cqLevel":33}' --webp '{"quality":75}' *.jpg -d ./dist/

# Options
-d, --output-dir <dir>     Output directory (default: ".")
-s, --suffix <suffix>      Append suffix to output files
--resize [config]          Resize before compressing
--mozjpeg [config]         MozJPEG → .jpg
--webp [config]            WebP → .webp
--avif [config]            AVIF → .avif
--jxl [config]             JPEG-XL → .jxl
--oxipng [config]          OxiPNG → .png
```

## Default AVIF Config (from codecs.ts)

```json
{
  "cqLevel": 33,
  "cqAlphaLevel": -1,
  "denoiseLevel": 0,
  "tileColsLog2": 0,
  "tileRowsLog2": 0,
  "speed": 6,
  "subsample": 1,
  "chromaDeltaQ": false,
  "sharpness": 0
}
```

## Known Limitation (AVIF)

The `auto` optimizer does NOT reliably work with `--avif`: it outputs at ~quality 30 regardless of the target. Use explicit `cqLevel` values instead.

## Dockerized Version

Available as `willh/squoosh-cli` on Docker Hub for CI environments that cannot install Node.js:
```bash
docker run --rm -it -v ${PWD}:/data willh/squoosh-cli --avif '{"cqLevel":33}' -d out *.jpg
```

## Relevance to image-optimization-stinger

Provides the exact CLI flags and default config values for `guides/05-tooling-pipeline.md`. The AVIF `auto` limitation is a gotcha worth calling out explicitly in the guide.

## Direct Quotes / Data Points

- "Squoosh CLI is currently not the fastest image compression tool in town and doesn't aim to be. It is, however, fast enough to compress many images sufficiently quick at once."
- "Squoosh's build-time optimization use case has real value for static sites and documentation sites."
- Warning on `--avif auto`: "qualityオプションに正しく対応しておらず... 30相当のqualityで書き出してしまう" (outputs quality 30 regardless of auto setting)
