# Guide 03: Accessibility Contract

Source: `research/external/icon-accessibility.md`

Every icon in a React application falls into one of three categories. The category determines the required ARIA attributes.

## Category 1: Decorative icons

**Definition:** The icon accompanies visible text that conveys the same information. Removing the icon would not reduce the information available to the user.

**Required attributes on the `<svg>` element:**
- `aria-hidden="true"`: removes the icon from the accessibility tree
- `focusable="false"`: prevents keyboard focus on the SVG in legacy environments

```tsx
// Correct
<button>
  <ArrowRight aria-hidden="true" focusable="false" size={16} />
  Continue
</button>

// Wrong — no aria-hidden; screen reader may announce "graphic" or the SVG title
<button>
  <ArrowRight size={16} />
  Continue
</button>
```

## Category 2: Semantic icons (standalone)

**Definition:** The icon conveys meaning without any adjacent visible text label. Removing the icon would remove information from the UI.

**Required:** An accessible name via one of these approaches:

### 2A: `aria-label` on the container (preferred)
```tsx
<span role="img" aria-label="Verified">
  <CheckCircle aria-hidden="true" focusable="false" size={20} />
</span>
```

### 2B: Visually hidden text
```tsx
<span>
  <CheckCircle aria-hidden="true" focusable="false" size={20} />
  <span className="sr-only">Verified</span>
</span>
```

### 2C: `<title>` inside the SVG (inline SVG only; less consistent screen reader support)
```tsx
<svg role="img" aria-labelledby="check-title" width="20" height="20">
  <title id="check-title">Verified</title>
  {/* paths */}
</svg>
```

**Recommendation:** Prefer 2A or 2B. The `<title>` approach (2C) has inconsistent screen reader support and is only appropriate when the icon component exposes a `title` prop that inserts a `<title>` element.

## Category 3: Interactive icons (icon buttons)

**Definition:** The icon is wrapped in an interactive element (`<button>`, `<a>`) with no visible text label.

**WCAG 2.1 SC 4.1.2 (Level A):** Every interactive element must have an accessible name.

**Required:** `aria-label` on the `<button>` or `<a>` element. The SVG itself gets `aria-hidden="true"`.

```tsx
// Correct
<button type="button" aria-label="Close dialog" onClick={onClose}>
  <X aria-hidden="true" focusable="false" size={20} />
</button>

// Correct (visually-hidden text variant)
<button type="button" onClick={onClose}>
  <X aria-hidden="true" focusable="false" size={20} />
  <span className="sr-only">Close dialog</span>
</button>

// Wrong — no accessible name; axe-core `button-name` failure
<button type="button" onClick={onClose}>
  <X size={20} />
</button>
```

## Accessibility checklist (run before declaring done)

- [ ] Every decorative icon has `aria-hidden="true"` and `focusable="false"` on the `<svg>`.
- [ ] Every semantic standalone icon has an accessible name (aria-label, sr-only text, or title).
- [ ] Every icon button has `aria-label` on the `<button>` or `<a>` element.
- [ ] No icon uses `role="img"` without also providing an accessible name via `aria-label` or `aria-labelledby`.
- [ ] Custom SVG components set `focusable="false"` on the `<svg>` element.

## axe-core rules this contract satisfies

| axe rule | Satisfied by |
|---|---|
| `svg-img-alt` | `aria-hidden="true"` on decorative icons OR accessible name on semantic icons |
| `button-name` | `aria-label` on icon buttons |
| `image-alt` | Accessible name on `role="img"` elements |

## Icon component wrapper pattern

A typed wrapper that enforces the contract at the component API level:

```tsx
interface IconProps extends SVGProps<SVGSVGElement> {
  /** Accessible label. When provided, adds role="img" and aria-label. */
  label?: string;
}

function Icon({ label, children, ...svgProps }: IconProps) {
  if (label) {
    return (
      <svg role="img" aria-label={label} focusable="false" {...svgProps}>
        {children}
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" focusable="false" {...svgProps}>
      {children}
    </svg>
  );
}
```

See `examples/lucide-icon-component.md` for a full typed implementation using Lucide's `LucideIcon` type.
