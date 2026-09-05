# Iconify React: Research Note

**Source type:** official-docs  
**Authority:** high  
**Relevance:** high  
**Topic:** Iconify React component, static vs CDN mode, RSC boundary

## Key findings (2026)

### Two delivery modes

**Mode 1: Static (bundled) icons**
```tsx
import { Icon } from '@iconify/react';
import arrowRight from '@iconify/icons-lucide/arrow-right';

<Icon icon={arrowRight} />
```
- Requires `@iconify/icons-<set>` package (one package per icon set).
- Icons are bundled at build time; no runtime API calls.
- Compatible with React Server Components.
- Tree-shaking works at the per-icon import level.

**Mode 2: On-demand CDN loading**
```tsx
import { Icon } from '@iconify/react';

<Icon icon="lucide:arrow-right" />
// Fetches from https://api.iconify.design at runtime
```
- Requires `"use client"` boundary in Next.js App Router (uses browser fetch).
- Not suitable for SSR-critical content.
- Good for admin panels / dev tools where CDN latency is acceptable.

### Self-hosted API
Iconify provides a self-hosted API server (`@iconify/api`) for production apps that do not want external CDN dependency. The self-hosted server returns the same JSON format as the public API.

### RSC boundary summary
| Mode | RSC compatible? | Notes |
|---|---|---|
| Static bundled (`@iconify/icons-*`) | Yes | Pure data objects, no browser APIs |
| On-demand CDN | No | Uses browser fetch; needs `"use client"` |
| Self-hosted API | No | Same as CDN mode from the component's perspective |

### When to prefer Iconify
- Project needs icons from multiple libraries (Lucide + Material + Phosphor) in a single component.
- Icon set is large (500+) and only a small subset is used per page: on-demand loading saves initial bundle.
- Design system uses Iconify's unified icon naming scheme.

## Caveats
- Iconify's CDN has no documented rate limit but recommends self-hosting for production.
- The `@iconify/react` package is ~8KB gzipped; may not be worth it for single-library projects.
