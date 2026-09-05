# Image Optimization Tooling

> Derived from: `research/external/2026-05-20-sharp-image-processing.md`, `research/external/2026-05-20-squoosh-cli-npm.md`, `research/external/2026-05-20-squoosh-cli-avif-webp.md`, `research/external/2026-05-20-sharp-squoosh-tooling-2026.md`, `research/external/2026-05-20-lqip-sharp-npm-blur-images.md`

---

## Tool selection guide

| Tool | Use case | Platform | Status |
|---|---|---|---|
| **Sharp** | Node.js build pipelines, LQIP generation, batch conversion, server-side processing | Any (Node.js) | Production-grade; v0.34.5, actively maintained |
| **Squoosh CLI** | One-off local conversions, quick format exploration | Any | Experimental; last active commit 2022; use for local ad-hoc only |
| **ImageOptim** | Lossless PNG/JPEG compression without format conversion | macOS only | Useful for designers; not suitable for CI pipelines |
| **Vercel/Next.js built-in** | Runtime optimization at request time | Vercel hosting | No code required; format negotiation via Accept headers |

**Primary recommendation:** Use **Sharp** for all Node.js/Next.js image processing. It is the only production-grade option for automated pipelines in 2026.

---

## Sharp: core operations

```javascript
import sharp from 'sharp';

// Install: npm install sharp

// Convert JPEG to AVIF + WebP
await sharp('src/hero.jpg')
  .avif({ quality: 55 })
  .toFile('public/hero.avif');

await sharp('src/hero.jpg')
  .webp({ quality: 80 })
  .toFile('public/hero.webp');

// Resize + convert in one pass
await sharp('src/product.jpg')
  .resize(800, undefined, { fit: 'inside', withoutEnlargement: true })
  .avif({ quality: 55 })
  .toFile('public/product-800.avif');

// Generate LQIP (see guides/03-placeholders.md)
const lqip = await sharp('src/hero.jpg')
  .resize(16, undefined, { fit: 'inside' })
  .webp({ quality: 20 })
  .toBuffer();
const blurDataURL = `data:image/webp;base64,${lqip.toString('base64')}`;

// Extract dominant color for solid placeholder
const { dominant } = await sharp('src/hero.jpg').stats();
const hex = `#${[dominant.r, dominant.g, dominant.b]
  .map(v => v.toString(16).padStart(2, '0'))
  .join('')}`;
```

### Batch conversion script

```javascript
// scripts/optimize-images.mjs
import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';

const sources = await glob('src/images/**/*.{jpg,jpeg,png}');

for (const src of sources) {
  const name = path.basename(src, path.extname(src));
  const outDir = path.dirname(src).replace('src/images', 'public/images');

  // Generate responsive variants
  for (const width of [640, 1024, 1920]) {
    const resizer = sharp(src).resize(width, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    await resizer.clone().avif({ quality: 55 }).toFile(`${outDir}/${name}-${width}.avif`);
    await resizer.clone().webp({ quality: 80 }).toFile(`${outDir}/${name}-${width}.webp`);
  }
}
```

---

## Squoosh CLI: one-off conversions

**Note:** Squoosh CLI is experimental and last updated in 2022. Use it only for local, one-off format conversion where you don't want to write a Node.js script.

```bash
# Install (one-time, if not already installed)
npx @squoosh/cli --help

# Convert a single JPEG to AVIF
npx @squoosh/cli --avif '{"quality":55}' hero.jpg

# Convert to both AVIF and WebP
npx @squoosh/cli --avif '{"quality":55}' --webp '{"quality":80}' hero.jpg

# Batch convert a folder
npx @squoosh/cli --avif '{"quality":55}' public/images/*.jpg
```

Squoosh CLI does NOT support LQIP generation, responsive resizing, or build pipeline integration. Use Sharp for anything beyond simple format conversion.

---

## ImageOptim (macOS only)

ImageOptim applies lossless compression to JPEG and PNG files: it doesn't convert formats, it just strips metadata and optimizes encoding. Useful as a final step before publishing static assets from a design file.

```bash
# Install ImageOptim-CLI (macOS only)
npm install -g imageoptim-cli

# Losslessly optimize a folder of images
imageoptim --imagealpha 'public/images/**'
```

**CI caveat:** ImageOptim-CLI wraps the macOS ImageOptim app, so it only works on macOS runners. For CI, use Sharp's built-in lossless modes or `optipng`/`mozjpeg` instead.

---

## Build pipeline integration (Next.js)

The recommended pattern for Next.js projects is to run Sharp conversion in a `prebuild` npm script:

```json
{
  "scripts": {
    "prebuild": "node scripts/optimize-images.mjs",
    "build": "next build"
  }
}
```

Alternatively, use a Next.js plugin like `next-optimized-images` or write a custom loader (see `guides/04-next-image.md`).

For Vercel deployments, `next/image` handles runtime optimization automatically. Manual pre-conversion is still recommended for your source images to reduce Vercel Image Optimization transformation counts.

---

## plaiceholder (LQIP for Next.js)

`plaiceholder` is the community-standard library for generating `blurDataURL` values for `next/image`. It wraps Sharp internally.

```javascript
import { getPlaiceholder } from 'plaiceholder';

// In an async server component or getStaticProps:
const file = fs.readFileSync('./public/hero.jpg');
const { base64 } = await getPlaiceholder(file);

// base64 is a ~40-60 char data URI ready for blurDataURL
```

Install: `npm install plaiceholder sharp`

> Source: `research/external/2026-05-20-plaiceholder-nextjs-blurdataurl.md`
