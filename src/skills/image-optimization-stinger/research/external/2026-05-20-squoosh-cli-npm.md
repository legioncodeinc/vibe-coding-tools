---
url: https://www.npmjs.com/package/@squoosh/cli
title: "@squoosh/cli - npm"
date: 2026-05-20
source_type: github-readme
authority: high
relevance: high
topic: tooling-squoosh
stinger: image-optimization-stinger
---

# @squoosh/cli - npm

## Summary

Official npm page for Squoosh CLI. Confirms the tool is experimental but functional for batch image conversion using WebAssembly-powered codecs (MozJPEG, WebP, AVIF, JPEG XL, WebP2, OxiPNG). Uses a worker pool for parallelism. Supports resize, quantization, rotation, and format conversion. Can be run via `npx` without installation.

## Key quotations / statistics

- "Squoosh CLI is an *experimental* way to run all the codecs you know from the Squoosh web app on your command line using WebAssembly."
- "Squoosh CLI is currently not the fastest image compression tool in town and doesn't aim to be. It is, however, fast enough to compress many images sufficiently quick at once."
- npx usage: `npx @squoosh/cli <options...>`
- Full option list:
  ```
  --resize [config]    Resize the image before compressing
  --quant [config]     Reduce the number of colors used
  --rotate [config]    Rotate image
  --mozjpeg [config]   Use MozJPEG to generate a .jpg file
  --webp [config]      Use WebP to generate a .webp file
  --avif [config]      Use AVIF to generate a .avif file
  --jxl [config]       Use JPEG-XL to generate a .jxl file
  --oxipng [config]    Use OxiPNG to generate a .png file
  -d, --output-dir     Output directory
  -s, --suffix         Append suffix to output files
  ```
- "The default values for each `config` option can be found in the `codecs.ts` file under `defaultEncoderOptions`."
- Auto optimizer: `npx @squoosh/cli --wp2 auto test.png` (targets Butteraugli distance 1.4 by default).
- AVIF batch conversion: `npx @squoosh/cli --avif '{"quality":50,"effort":4}' -d output *.jpg`
- WebP batch conversion: `npx @squoosh/cli --webp '{"quality":75}' -d output *.jpg`

## Annotations for stinger-forge

- The "experimental" label is important to flag in `guides/05-tooling.md` -- Squoosh CLI is maintained but not production-hardened; prefer Sharp for Node.js pipelines.
- The AVIF flag `--avif` with quality 50 and effort 4 is the recommended starting point from filemint.dev research.
- The `--resize` option can generate multiple responsive variants in one pass -- document in `guides/05-tooling.md`.
- Note: Squoosh CLI was last meaningfully updated in 2022 and the `@squoosh/cli` npm package is at version 0.7.3. For new projects, Sharp is more actively maintained.
