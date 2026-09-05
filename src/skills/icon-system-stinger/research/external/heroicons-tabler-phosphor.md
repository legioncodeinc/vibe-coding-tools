# Heroicons / Tabler / Phosphor: Research Note

**Source type:** comparison  
**Authority:** medium  
**Relevance:** medium  
**Topic:** Comparative overview of Heroicons v2, Tabler 4.x, Phosphor 2.x

## Heroicons v2 (2026)

- **Maintainer:** Tailwind Labs (same team as Tailwind CSS)
- **Icon count:** ~292 icons in outline, solid, and mini (20px) variants
- **Design style:** Clean, Tailwind-native aesthetic; 24px default viewBox
- **Package:** `@heroicons/react`: pure ESM, fully tree-shakeable
- **Import pattern:**
  ```tsx
  import { ArrowRightIcon } from '@heroicons/react/24/outline';
  import { ArrowRightIcon } from '@heroicons/react/24/solid';
  ```
- **RSC compatible:** Yes
- **Best for:** Projects using Tailwind CSS; limited icon needs (under 300)
- **TypeScript:** Full type coverage via `@heroicons/react`

## Tabler Icons v4 (2026)

- **Maintainer:** Tabler (open source)
- **Icon count:** 5500+ icons, single stroke weight
- **Design style:** Consistent 2px stroke, 24px viewBox; works well in admin UIs
- **Package:** `@tabler/icons-react`: ESM, tree-shakeable per icon
- **Import pattern:**
  ```tsx
  import { IconArrowRight } from '@tabler/icons-react';
  ```
- **RSC compatible:** Yes
- **Best for:** Large admin panels or dashboards requiring extensive icon coverage
- **Caveats:** The large icon count means the full type definition file is large; some IDEs slow down on autocomplete

## Phosphor Icons v2 (2026)

- **Maintainer:** Phosphor Icons (open source)
- **Icon count:** 1300+ icons across 6 weights (thin/light/regular/bold/fill/duotone)
- **Design style:** Multi-weight system; versatile for design-system-heavy products
- **Package:** `@phosphor-icons/react`: ESM, tree-shakeable per icon+weight combo
- **Import pattern:**
  ```tsx
  import { ArrowRight } from '@phosphor-icons/react';
  // With weight:
  import { ArrowRight } from '@phosphor-icons/react'; // uses `weight` prop
  <ArrowRight weight="bold" />
  ```
- **RSC compatible:** Yes
- **Bundle warning:** Each weight variant is the same icon at a different stroke path; importing the same icon at multiple weights does NOT double-bundle in v2 (weight is a prop, not a separate module).
- **Best for:** Products with a rich design language that needs icon weight variation

## Selection summary

| Library | Use when |
|---|---|
| Lucide | Default React/Next.js projects; best DX; most community examples |
| Heroicons | Tailwind CSS projects needing a curated, small set |
| Tabler | Admin UIs needing 500+ unique icons |
| Phosphor | Design-system-heavy products needing weight variants |
| Iconify | Multi-library mixing or very large sets with on-demand loading |
