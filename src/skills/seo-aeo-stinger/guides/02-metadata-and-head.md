# 02. Metadata and head management

Svelte 5's `<svelte:head>`, load functions, per-route metadata.

## The rule

`<svelte:head>` writes into `document.head` during server-side rendering, so a crawler running no JavaScript sees title, description, and canonical in the first response. It also updates reactively on client-side navigation. This is the only mechanism this stack uses for head management -- no third-party head-management library is needed or recommended. [raw/seo-aeo--sveltekit-metadata--svelte-head-docs.md]

Constraint: `<svelte:head>` may only appear at a component's top level, never inside a block (`{#if}`, `{#each}`) or another element. [raw/seo-aeo--sveltekit-metadata--svelte-head-docs.md]

## Where metadata comes from

Return SEO data from a `load` function, not from `onMount()` or component-local state. `onMount()` is client-only; metadata set there is absent from the first server-rendered response, which is what crawlers and AI-answer engines fetch. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]

Two `load` flavors both work for SEO, because the first response is always server-rendered regardless of which you use:

| Capability | `+page.server.ts` | `+page.ts` |
| --- | --- | --- |
| Runs during server render | Yes | Yes |
| Runs on client navigation | No | Yes |
| Database access & secrets | Yes | No |
| Reads request headers | Yes | No |
| Feeds `svelte:head` metadata | Yes | Yes |

Use `+page.server.ts` when metadata depends on a CMS token, a database call, or request headers (e.g. a Payload REST fetch with an auth header). Use `+page.ts` when the data is public and can safely run client-side too. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md]

## Use the shared helper, not ad hoc meta tags

Every route calls `generateSEO()` from `references/metadata-helper-pattern.md` (mirrors `website-stinger/templates/generateSEO.svelte.ts` exactly -- do not fork the shape). This keeps `title`, `description`, `canonical`, Open Graph, and Twitter Card fields consistent across the whole site instead of hand-writing meta tags per route.

```ts
// +page.ts
import type { PageLoad } from './$types';
import { generateSEO } from '$lib/seo/generateSEO';

export const load: PageLoad = ({ url }) => ({
  seo: generateSEO({
    title: 'Services',
    description: 'What we do and how we do it.',
    url: url.pathname,
  }),
});
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.seo.title}</title>
  <meta name="description" content={data.seo.description} />
  <link rel="canonical" href={data.seo.canonical} />
</svelte:head>
```

See `references/metadata-helper-pattern.md` for the full field set (Open Graph, Twitter Card, article timestamps, `noindex`).

## Root-layout defaults, per-route overrides

A common pattern: read `page.data` in the root `+layout.svelte` for a site-wide fallback, and let individual routes override with their own `<svelte:head>` block further down the tree -- both apply, since `<svelte:head>` blocks compose across the layout hierarchy. Every route must still return its own unique title/description from its own `load` -- relying on the layout default for every page produces duplicate titles/descriptions across the site, a common and easily-missed audit finding. [raw/seo-aeo--sveltekit-metadata--svelte-dev-seo-docs.md]

## noindex is sacred

Pages with `noindex: true` set intentionally (staging, preview, internal tools, thank-you pages) must not be silently "fixed." If a `noindex` or canonical value looks wrong during an audit, ask before changing it -- it may be deliberate.

## Common failure modes to catch in review

- Canonical computed from `window.location` in a component instead of `load` -- missing from the crawler-visible first response.
- Title/description set via `document.title` or an imperative client effect -- bypasses SSR entirely.
- SEO data fetched in `onMount()` -- same failure as above.
- A layout-level default relied on for every child route -- non-unique titles/descriptions site-wide.
- `<svelte:head>` placed inside an `{#if}` or `{#each}` block -- invalid per the Svelte compiler's constraints on this element.

All five are drawn from the same research pass and correspond to real audit findings reported against production SvelteKit sites. [raw/seo-aeo--sveltekit-metadata--rendering-config-seo-architecture.md], [raw/seo-aeo--sveltekit-metadata--svelte-head-docs.md]
