# Example: Next.js Image with AVIF, Correct sizes, and LQIP Placeholder

> Happy path. Demonstrates: AVIF/WebP formats in next.config, correct `sizes` for a 3-column product grid, LQIP blur placeholder via plaiceholder, and `priority` on the LCP hero.
>
> Guides exercised: `guides/00-principles.md`, `guides/01-format-selection.md`, `guides/02-srcset-sizes.md`, `guides/03-placeholders.md`, `guides/04-next-image.md`, `guides/05-tooling.md`

---

## Setup: next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],  // Principle 1: AVIF first
    remotePatterns: [],  // Add external hostnames here if needed
    minimumCacheTTL: 60 * 60 * 24 * 30,   // 30 days
  },
};

export default config;
```

---

## LQIP generation utility

```typescript
// lib/lqip.ts
import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs';
import path from 'path';

export async function getLQIP(src: string): Promise<string> {
  // src is relative to /public, e.g. "/products/shoe.jpg"
  const filePath = path.join(process.cwd(), 'public', src);
  const file = fs.readFileSync(filePath);
  const { base64 } = await getPlaiceholder(file);
  return base64;
}
```

---

## LCP Hero Image (above the fold)

```typescript
// app/page.tsx
import Image from 'next/image';

export default function HomePage() {
  return (
    <section>
      {/*
        LCP candidate: full-width hero
        - priority: disables lazy loading, injects <link rel="preload"> (Next.js <16)
        - preload: same behavior in Next.js 16+
        - No placeholder needed: priority ensures it loads before paint
        - sizes="100vw": correct for full-bleed hero
      */}
      <Image
        src="/hero.jpg"
        alt="Product hero — summer collection 2026"
        width={1920}
        height={1080}
        priority              // Use `preload` for Next.js 16+
        sizes="100vw"
        quality={85}
      />
    </section>
  );
}
```

---

## Product Grid Card (below the fold, with LQIP)

```typescript
// app/products/page.tsx
import Image from 'next/image';
import { getLQIP } from '@/lib/lqip';

type Product = { id: string; name: string; imageSrc: string };

// Fetch products at build/request time
async function getProducts(): Promise<Product[]> {
  return [
    { id: '1', name: 'Blue Shoe', imageSrc: '/products/shoe-blue.jpg' },
    { id: '2', name: 'Red Hat', imageSrc: '/products/hat-red.jpg' },
  ];
}

export default async function ProductsPage() {
  const products = await getProducts();

  // Generate LQIP for each product at render time (Server Component)
  const productsWithLQIP = await Promise.all(
    products.map(async (p) => ({
      ...p,
      blurDataURL: await getLQIP(p.imageSrc),
    }))
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productsWithLQIP.map((product) => (
        <div key={product.id}>
          <Image
            src={product.imageSrc}
            alt={product.name}
            width={600}
            height={600}
            /*
             * sizes: 1 col on mobile, 2 on sm, 3 on lg
             * Matches the grid CSS above — Principle 4
             */
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={product.blurDataURL}
            loading="lazy"  // OK: these are not LCP candidates
          />
          <p>{product.name}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## What this example demonstrates

| Principle | Where applied |
|---|---|
| AVIF first (Principle 1) | `formats: ['image/avif', 'image/webp']` in `next.config` |
| `width` + `height` always (Principle 2) | All `<Image>` elements have explicit dimensions |
| LCP gets `priority` (Principle 3) | Hero has `priority`; grid cards use `loading="lazy"` |
| `sizes` matches layout (Principle 4) | Hero: `100vw`; cards: 3-column breakpoint formula |
| Placeholder is deliberate (Principle 5) | LQIP via plaiceholder on grid cards; none needed on hero (priority loads fast) |

---

## Expected output

- Hero image: zero layout shift, LCP < 2.5s on desktop (assuming CDN + HTTP/2)
- Product grid: smooth blur-to-crisp transition on each card; no pop-in
- Lighthouse Performance: 90+ on mobile when combined with AVIF delivery
