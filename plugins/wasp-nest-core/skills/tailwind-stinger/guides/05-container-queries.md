# Container queries

## Core feature, no plugin

Tailwind v3 needed the separate `@tailwindcss/container-queries` plugin. In v4 this is core; no install required beyond Tailwind itself. [raw/09-v4-release-notes-performance-features.md]

## Basic pattern

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- responds to the .@container parent's width, not the viewport -->
  </div>
</div>
```

`@container` marks the parent as an inline-size query container (`container-type: inline-size`). Child variants like `@sm`, `@md` are mobile-first, same as breakpoint variants: they apply at that container size and up. [raw/06-container-queries.md]

## When to reach for this instead of a viewport breakpoint

Page-level layout decisions (nav visibility, page grid column count) belong to viewport media queries (`md:`, `lg:`). Component-level layout that needs to adapt to wherever it's mounted (a card that lives in a sidebar sometimes and a full-width grid other times) belongs to container queries (`@md:`, `@lg:`). The two compile to different at-rules (`@media` vs `@container`) and can be freely mixed on the same page. [raw/14-container-queries-migration-practice.md]

## Max-width and ranges

```html
<div class="@container">
  <div class="flex flex-row @max-md:flex-col"><!-- below @md --></div>
</div>

<div class="@container">
  <div class="flex flex-row @sm:@max-md:flex-col"><!-- only within the @sm to @md range --></div>
</div>
```

[raw/06-container-queries.md]

## Named containers for nested containers

When a container sits inside another container, an unnamed `@md:` targets the nearest ancestor container, which may not be the one intended. Name containers to be explicit:

```html
<div class="@container/main">
  <div class="flex flex-row @sm/main:flex-col">
    <!-- targets the "main" container specifically, not whatever is nearest -->
  </div>
</div>
```

[raw/06-container-queries.md], [raw/14-container-queries-migration-practice.md]

## Size containers for block-size-dependent units

`@container` alone only supports inline-size (width) queries. For units that depend on block size (`cqb`, `cqh`), mark the container with `@container-size` instead (maps to `container-type: size`):

```html
<div class="@container-size">
  <div class="h-[50cqb]"><!-- ... --></div>
</div>
```

`@container-size` was added in Tailwind v4.3.0 (May 2026); before that, this required an arbitrary `[container-type:size]` value. There's still no built-in `@min-h-*`/`@max-h-*` height-query variant; write those as arbitrary variants: `[@container_(height>384px)]:flex-col`. [raw/06-container-queries.md]

## Custom container sizes

```css
@theme {
  --container-8xl: 96rem;
}
```

```html
<div class="@container">
  <div class="flex flex-col @8xl:flex-row"><!-- ... --></div>
</div>
```

[raw/06-container-queries.md]

## Default size scale (for reference, all smaller than same-named viewport breakpoints)

`@3xs` 16rem, `@2xs` 18rem, `@xs` 20rem, `@sm` 24rem, `@md` 28rem, `@lg` 32rem, `@xl` 36rem, `@2xl` 42rem, `@3xl` 48rem, `@4xl` 56rem, `@5xl` 64rem, `@6xl` 72rem, `@7xl` 80rem. [raw/06-container-queries.md]

A common mistake migrating from viewport breakpoints is assuming `md:` and `@md:` are the same pixel value; they aren't (768px vs 448px). Pick container breakpoints based on the actual space the component gets, not the viewport breakpoint it happened to replace. [raw/14-container-queries-migration-practice.md]

## Svelte 5 worked example

```svelte
<script lang="ts">
  let { title, body }: { title: string; body: string } = $props();
</script>

<div class="@container rounded-xl border p-4">
  <div class="flex flex-col gap-2 @md:flex-row @md:items-center @md:gap-4">
    <h3 class="font-semibold @md:w-40 @md:shrink-0">{title}</h3>
    <p class="text-sm text-gray-600">{body}</p>
  </div>
</div>
```

This card stacks vertically in a narrow sidebar slot and goes horizontal once its actual container hits 448px, regardless of the browser viewport width.
