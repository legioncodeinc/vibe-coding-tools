---
name: "icon-system-stinger"
description: "Icon-system specialist for React/Next.js: library selection (Lucide, Heroicons, Tabler, Phosphor, Iconify), tree-shake-vs-SVG-sprite trade-off, dynamic-import-by-name pattern, custom SVG component authoring, and the accessibility contract (aria-hidden for decorative icons, aria-label for semantic icons, accessible name for icon buttons). Use when choosing an icon library, debugging bundle-size regressions from icon imports, wiring a dynamic icon loader, building a custom SVG wrapper, or auditing icon accessibility. Paired with `icon-system-worker-bee`."
---

# icon-system Stinger

Procedural arsenal for `icon-system-worker-bee`. Encodes the canonical icon library selection matrix, the tree-shake-vs-SVG-sprite delivery decision, the dynamic-import-by-name pattern, custom SVG component conventions, and the accessibility contract covering the three icon categories (decorative, semantic, interactive).

---

## When this stinger applies

Load when `icon-system-worker-bee` is invoked. Typical triggers:

- "Which icon library should we use?"
- "My icon imports are bloating the bundle"
- "How do I load an icon by name at runtime?"
- "Build me a reusable icon component"
- "Audit our icons for accessibility"
- "Should I use an SVG sprite?"
- "Icon button has no accessible name"

Do NOT load for:

- Icon size and color tokens (ux-ui-svelte-worker-bee owns those)
- General React component architecture (react-worker-bee)
- SVG sprite build-pipeline tooling at the bundler level (devops-worker-bee)
- General bundle-optimization strategies beyond icon imports (devops-worker-bee)

---

## First action when this stinger is loaded

1. Read `guides/00-library-selection-matrix.md`: pick the right icon library first.
2. Read `guides/01-tree-shake-vs-sprite.md`: choose the delivery strategy.
3. Read the per-task guide relevant to the request (02 through 04).
4. Use `templates/icon-audit-report.md` to structure any output audit report.

---

## Library selection matrix (summary)

| Library | Best for | Icon count | Tree-shaking |
|---|---|---|---|
| **Lucide** | Default React/Next.js apps; best DX | 1400+ | Named ESM exports; full |
| **Heroicons** | Tailwind CSS projects; curated small set | ~292 | Named ESM by variant path |
| **Tabler** | Admin UIs needing extensive coverage | 5500+ | Named ESM per icon |
| **Phosphor** | Design systems needing weight variants | 1300+ | Named ESM; weight is a prop |
| **Iconify** | Multi-library mixing OR large on-demand sets | 200,000+ | Static bundled or CDN |

See `guides/00-library-selection-matrix.md` for the full decision table with edge cases and installation snippets.

---

## Tree-shake vs SVG sprite (summary)

| Strategy | When to choose |
|---|---|
| Named ESM imports (default) | Single app, defined icon set, <200 icons |
| SVG sprite | Icons needed in 3+ separate JS bundles; non-React rendering contexts |
| Iconify on-demand (CDN) | Large icon sets where most icons appear on few pages; admin tools only |

See `guides/01-tree-shake-vs-sprite.md` for the full decision matrix and Vite/Next.js configuration snippets.

---

## Dynamic icon by name (summary)

For cases where the icon name arrives as a string prop at runtime:

```tsx
// Safe approach: static map built at compile time
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = LucideIcons as any;

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
```

Do NOT use `React.lazy` per-icon for above-the-fold content. See `guides/02-dynamic-import-icon-name.md` for the full pattern, TypeScript safety, and RSC boundary guidance.

---

## Accessibility contract (summary)

| Icon category | Required attributes |
|---|---|
| Decorative (has adjacent text) | `aria-hidden="true"` + `focusable="false"` on SVG |
| Semantic (standalone, no text) | `aria-label` on container OR `role="img"` + `<title>` on SVG |
| Interactive (icon button) | `aria-label` on `<button>`; SVG gets `aria-hidden="true"` |

See `guides/03-accessibility-contract.md` for implementation details and axe-core failure modes. Source: `research/external/icon-accessibility.md`.

---

## Critical directives

- **Never import from a library's barrel root unless tree-shaking is guaranteed.** Barrel imports from `some-icon-lib` without ESM named exports bundle every icon. Use named imports or path imports. See `guides/01-tree-shake-vs-sprite.md`.
- **Always apply the decorative-vs-semantic distinction.** Every icon must either be hidden from AT (`aria-hidden="true"`) or carry an accessible name. Unlabeled icon buttons are a WCAG 2.1 Level A failure.
- **Never use dynamic-by-name for SSR-critical above-the-fold icons.** Dynamic imports introduce loading waterfalls; use static named imports for hero content.
- **Prefer Iconify only when multi-library mixing is genuinely needed.** Single-library projects pay Iconify's runtime overhead without benefit.
- **Custom SVG components must set `focusable="false"` on the `<svg>` element.** Without it, SVGs receive keyboard focus in legacy Edge and some screen readers.

---

## Folder layout

```
icon-system-stinger/
├── SKILL.md                              (this file)
├── README.md
├── guides/
│   ├── 00-library-selection-matrix.md
│   ├── 01-tree-shake-vs-sprite.md
│   ├── 02-dynamic-import-icon-name.md
│   ├── 03-accessibility-contract.md
│   └── 04-custom-svg-component.md
├── examples/
│   ├── lucide-icon-component.md
│   └── dynamic-icon-loader.md
├── templates/
│   └── icon-audit-report.md
├── reports/
│   └── README.md
└── research/
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── internal/
    │   └── command-brief.md
    └── external/
        ├── lucide-react.md
        ├── iconify-react.md
        ├── heroicons-tabler-phosphor.md
        ├── icon-sprite-patterns.md
        └── icon-accessibility.md
```

---

*Forged by stinger-forge from `icon-system-worker-bee-command-brief.md` and `research/`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
