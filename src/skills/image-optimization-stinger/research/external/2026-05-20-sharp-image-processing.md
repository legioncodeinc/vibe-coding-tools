---
url: https://sharp.pixelplumbing.com
title: "High performance Node.js image processing | sharp"
date: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: tooling-sharp
stinger: image-optimization-stinger
---

# Sharp - High Performance Node.js Image Processing

## Summary

Official Sharp documentation site. Sharp is the recommended Node.js image processing library for production pipelines, powered by libvips (4-5x faster than ImageMagick/GraphicsMagick). Supports JPEG, PNG, WebP, GIF, AVIF, TIFF, SVG input and output. Compatible with Node.js >=18.17.0, Deno, and Bun. Latest version: v0.34.5 (Nov 2025). No additional install dependencies on modern macOS, Windows, and Linux.

## Key quotations / statistics

- "Resizing an image is typically 4x-5x faster than using the quickest ImageMagick and GraphicsMagick settings due to its use of libvips."
- "This module supports reading JPEG, PNG, WebP, GIF, AVIF, TIFF and SVG images. Output images can be in JPEG, PNG, WebP, GIF, AVIF and TIFF formats as well as uncompressed raw pixel data."
- Installation: `npm install sharp`
- WebP output: `sharp('input.jpg').resize(400).webp({ quality: 80 }).toFile('output.webp')`
- AVIF output (via format conversion):
  ```js
  await sharp(inputPath).avif({ quality: 65 }).toFile(outputPath);
  ```
- LQIP generation (tiny thumbnail for placeholder):
  ```js
  const placeholder = await sharp(src)
    .resize(16, 16, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer();
  const dataURL = `data:image/webp;base64,${placeholder.toString('base64')}`;
  ```
- MozJPEG encoding: `.jpeg({ mozjpeg: true })`
- Streaming: supports Node.js read/write streams for pipeline integration.
- v0.34.5 released Nov 6, 2025 (latest in research window).

## Annotations for stinger-forge

- Sharp is the primary recommendation for Node.js build pipelines over Squoosh CLI (Sharp is faster, actively maintained, production-grade).
- The AVIF quality 65 setting from the OneUptime blog post corroborates filemint.dev's quality 40-60 recommendation -- use quality 60-70 for AVIF in Sharp.
- The 16x16 + quality 20 + WebP LQIP recipe from the Mux/blur-images research can be documented with Sharp code in `guides/03-placeholders.md`.
- Sharp's streaming API enables efficient batch processing in CI/CD pipelines -- mention in `guides/05-tooling.md`.
- Node.js version requirement (>= 18.17.0) is relevant for teams on older LTS versions.
