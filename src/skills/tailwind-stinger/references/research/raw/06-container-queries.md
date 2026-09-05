# Responsive design - Core concepts (container queries section)
- URL: https://tailwindcss.com/docs/responsive-design
- Fetched: 2026-08-14
- Source type: official docs
- Component: container-queries

## Container queries

### What are container queries?

Container queries are a modern CSS feature that let you style something based on the size of a parent element instead of the size of the entire viewport. They let you build components that are a lot more portable and reusable because they can change based on the actual space available for that component.

### Basic example

Use the `@container` class to mark an element as an inline-size container, then use variants like `@sm` and `@md` to style child elements based on the size of the container:

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- ... -->
  </div>
</div>
```

Just like breakpoint variants, container queries are mobile-first in Tailwind CSS and apply at the target container size and up.

### Max-width container queries

Use variants like `@max-sm` and `@max-md` to apply a style below a specific container size:

```html
<div class="@container">
  <div class="flex flex-row @max-md:flex-col">
    <!-- ... -->
  </div>
</div>
```

### Container query ranges

Stack a regular container query variant with a max-width container query variant to target a specific range:

```html
<div class="@container">
  <div class="flex flex-row @sm:@max-md:flex-col">
    <!-- ... -->
  </div>
</div>
```

### Named containers

For complex designs with multiple nested containers, name containers using `@container/{name}` and target specific containers with variants like `@sm/{name}` and `@md/{name}`:

```html
<div class="@container/main">
  <div class="flex flex-row @sm/main:flex-col">
    <!-- ... -->
  </div>
</div>
```

This makes it possible to style something based on the size of a distant container, rather than just the nearest one.

### Using size containers

Use `@container-size` to mark an element as a size container instead of an inline-size container when container query length units that depend on the block size (like `cqb`) are needed:

```html
<div class="@container-size">
  <div class="h-[50cqb]">
    <!-- ... -->
  </div>
</div>
```

Named size containers use `@container-size/{name}`.

### Using custom container sizes

Use the `--container-*` theme variables to customize container sizes:

```css
@import "tailwindcss";
@theme {
  --container-8xl: 96rem;
}
```

This adds a new `8xl` container query variant.

### Using arbitrary values

Use variants like `@min-[475px]` and `@max-[960px]` for one-off container query sizes:

```html
<div class="@container">
  <div class="flex flex-col @min-[475px]:flex-row">
    <!-- ... -->
  </div>
</div>
```

### Using container query units

Use container query length units like `cqw` and `cqi` as arbitrary values in other utilities to reference the container size: `w-[50cqw]`. For units needing block size (`cqb`, `cqh`), use `@container-size`.

### Container size reference

| Variant | Minimum width | CSS |
| --- | --- | --- |
| `@3xs` | 16rem (256px) | `@container (width >= 16rem) { … }` |
| `@2xs` | 18rem (288px) | `@container (width >= 18rem) { … }` |
| `@xs` | 20rem (320px) | `@container (width >= 20rem) { … }` |
| `@sm` | 24rem (384px) | `@container (width >= 24rem) { … }` |
| `@md` | 28rem (448px) | `@container (width >= 28rem) { … }` |
| `@lg` | 32rem (512px) | `@container (width >= 32rem) { … }` |
| `@xl` | 36rem (576px) | `@container (width >= 36rem) { … }` |
| `@2xl` | 42rem (672px) | `@container (width >= 42rem) { … }` |
| `@3xl` | 48rem (768px) | `@container (width >= 48rem) { … }` |
| `@4xl` | 56rem (896px) | `@container (width >= 56rem) { … }` |
| `@5xl` | 64rem (1024px) | `@container (width >= 64rem) { … }` |
| `@6xl` | 72rem (1152px) | `@container (width >= 72rem) { … }` |
| `@7xl` | 80rem (1280px) | `@container (width >= 80rem) { … }` |

## Container queries went core in v4.0 (no plugin needed)
- URL: https://tailwindcss.com/blog/tailwindcss-v4
- Fetched: 2026-08-14
- Source type: release notes
- Component: container-queries

Container queries — first-class APIs for styling elements based on their container size, no plugins required (the separate `@tailwindcss/container-queries` plugin from v3 is no longer needed).

```html
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-3 @lg:grid-cols-4">
    <!-- ... -->
  </div>
</div>
```

Max-width container queries via `@max-*`, and stacked `@min-*`/`@max-*` ranges, were added as part of core.

## @container-size added in v4.3.0
- URL: https://bondar.blog/container-queries-in-tailwindcss/
- Fetched: 2026-08-14
- Source type: blog (community)
- Component: container-queries

`@container-size` (mapping to `container-type: size`) was added in Tailwind CSS v4.3.0 (May 2026). Before that version, using `container-type: size` required an arbitrary value. Tailwind does not currently provide built-in height-based container query variants like `@min-h-*`/`@max-h-*`; those need arbitrary container query variants such as `[@container_(height>384px)]:flex-col`. Rule of thumb from this source: use `@container` for width-only queries, `@container-size` when height/block size also matters.
