# Icon Accessibility: Research Note

**Source type:** normative  
**Authority:** high  
**Relevance:** high  
**Topic:** WAI-ARIA APG, decorative/semantic/interactive model, icon button pattern

## The three icon categories

### 1. Decorative icons
Icons that accompany visible text and add no information beyond the text. The text itself provides the accessible name; the icon is redundant to assistive technology.

**Required attributes:**
```tsx
<svg aria-hidden="true" focusable="false" ...>
```
- `aria-hidden="true"`: hides the icon from the accessibility tree
- `focusable="false"`: prevents the SVG from being keyboard-focusable in IE/legacy Edge

**Example:**
```tsx
<button>
  <ArrowRightIcon aria-hidden="true" focusable="false" />
  Continue
</button>
```

### 2. Semantic icons (standalone, no adjacent text)
Icons that convey meaning without accompanying visible text. They must carry an accessible name.

**Two approaches:**

**A) `aria-label` on the container element:**
```tsx
<button aria-label="Go to next page">
  <ArrowRightIcon aria-hidden="true" />
</button>
```

**B) Visually-hidden text inside the container:**
```tsx
<button>
  <ArrowRightIcon aria-hidden="true" />
  <span className="sr-only">Go to next page</span>
</button>
```

**C) `<title>` inside the SVG (inline SVG only):**
```tsx
<svg role="img" aria-labelledby="icon-title">
  <title id="icon-title">Go to next page</title>
  {/* paths */}
</svg>
```
Note: `<title>` support across screen readers is inconsistent; prefer A or B.

### 3. Interactive icons (icon buttons)
Clickable icons. The accessible name lives on the interactive element, not the SVG.

**WCAG 2.1 Level A requirement:** Every interactive element must have an accessible name.

```tsx
// Correct
<button type="button" aria-label="Close dialog">
  <XIcon aria-hidden="true" focusable="false" size={20} />
</button>

// Wrong — no accessible name
<button type="button">
  <XIcon size={20} />
</button>
```

## Icon in SVG format: full accessible template

```tsx
interface IconProps extends SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

function ArrowRightIcon({ title, titleId, ...props }: IconProps) {
  return (
    <svg
      aria-hidden={!title}
      aria-labelledby={titleId}
      role={title ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      {title && <title id={titleId}>{title}</title>}
      {/* paths */}
    </svg>
  );
}
```

## WCAG references

- WCAG 2.1 SC 1.1.1 (Level A): Non-text content, decorative images must be hidden from AT
- WCAG 2.1 SC 4.1.2 (Level A): Name, Role, Value, interactive elements must have accessible names
- WAI-ARIA APG, Icon Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

## Common failures caught by axe-core

- SVG without `aria-hidden` or accessible name: `svg-img-alt` rule
- Interactive element with no accessible name: `button-name` rule
- `focusable="false"` missing on decorative SVG in IE-mode browsers: non-critical warning
