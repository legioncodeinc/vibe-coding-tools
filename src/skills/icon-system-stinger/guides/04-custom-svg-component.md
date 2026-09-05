# Guide 04: Custom SVG Component

Source: `research/external/icon-accessibility.md`, `research/external/lucide-react.md`

When the project needs icons not available in a standard library, or requires branded SVGs that must match an existing icon API, author a typed React SVG wrapper following these conventions.

## Canonical wrapper shape

```tsx
import type { SVGProps } from 'react';

interface CustomIconProps extends SVGProps<SVGSVGElement> {
  /** Size in pixels. Applied to both width and height. Default: 24 */
  size?: number | string;
  /** Accessible label. When provided, renders role="img" + aria-label. Omit for decorative icons. */
  label?: string;
}

function MyCustomIcon({ size = 24, label, className, ...svgProps }: CustomIconProps) {
  const accessibilityProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={className}
      {...accessibilityProps}
      {...svgProps}
    >
      {/* SVG path(s) */}
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export { MyCustomIcon };
```

## Key conventions

### `currentColor` fill/stroke
Use `stroke="currentColor"` (or `fill="currentColor"` for filled icons) so the icon inherits its color from the CSS `color` property. This integrates cleanly with Tailwind's `text-*` utilities and CSS variables.

```tsx
// Color via Tailwind
<MyCustomIcon className="text-blue-500" />

// Color via CSS variable
<MyCustomIcon style={{ color: 'var(--icon-color)' }} />
```

### `viewBox` normalization
Use a consistent `viewBox` across all custom icons. The convention from Lucide, Heroicons, and Tabler is `"0 0 24 24"` (24px grid). Avoid mixing `"0 0 16 16"` and `"0 0 24 24"` icons in the same library.

### `focusable="false"`
Always set `focusable="false"` on the root `<svg>`. Without this, SVGs receive keyboard focus in IE/legacy Edge and expose themselves as interactive elements in some screen readers.

### `strokeWidth` consistency
Match the stroke width of the icon library already in use:
- Lucide: `strokeWidth={2}`
- Heroicons: `strokeWidth={1.5}` (outline) / filled (no stroke)
- Tabler: `strokeWidth={2}`
- Phosphor: weight controlled by path data, not strokeWidth

## Exporting custom icons as a library

Group custom icons in a dedicated module and re-export them under a consistent naming convention:

```tsx
// icons/custom/index.ts
export { ArrowDiagonalIcon } from './ArrowDiagonalIcon';
export { LogoMarkIcon } from './LogoMarkIcon';
export { SparkleIcon } from './SparkleIcon';
```

This makes them importable alongside the chosen standard library:

```tsx
import { ArrowRight } from 'lucide-react';
import { LogoMarkIcon } from '@/icons/custom';
```

## SVGO optimization

When creating custom SVG components from designer-exported SVGs:

1. Run the SVG through [SVGO](https://svgo.dev/) to remove redundant attributes and normalize the path data.
2. Remove `width`, `height`, and any hardcoded `fill`/`stroke` color values (replace with `currentColor`).
3. Confirm the `viewBox` is preserved after optimization.

```bash
npx svgo --input raw-icon.svg --output optimized-icon.svg --config '{"plugins":["preset-default"]}'
```

## Checklist before shipping a custom icon

- [ ] `viewBox` matches the project's standard (usually `"0 0 24 24"`)
- [ ] `stroke="currentColor"` or `fill="currentColor"` (not hardcoded hex)
- [ ] `focusable="false"` on the `<svg>` element
- [ ] `label` prop wires `role="img"` + `aria-label`; without `label`, `aria-hidden="true"` is set
- [ ] Path data is SVGO-optimized
- [ ] Component is exported from the custom icons module
- [ ] Component passes axe-core checks in the test environment
