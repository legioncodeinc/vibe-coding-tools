# Using JSON-LD in SvelteKit Applications

- URL: https://dallas.lu/json-ld-in-sveltekit-app/
- Fetched: 2026-08-14
- Source type: community
- Component: structured-data

## Notes

JSON-LD is a JSON-format structured-data syntax paired with schema.org vocabulary, embedded in HTML documents to describe page content for search engines and AI systems.

`+layout` applies structured data to the whole site; `+page.svelte` applies it to a single page's content. SvelteKit does not automatically merge the two -- you compose them manually. Pattern: pre-organize shared JSON-LD in `+layout.ts`, then merge page-specific JSON-LD in `+page.svelte`:

```svelte
<script lang="ts">
    export let data;
    $: ({ ldjson } = data);

    let ldjson = () => {
        let creativeWork = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "Example Creative Work",
            "author": { "@type": "Person", "name": "Jane Doe" }
        };
        return Object.assign({}, ldjson, creativeWork);
    }
</script>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(json())}</script>`}
</svelte:head>
```

```ts
// +layout.ts
export const load: Load = async ({ fetch, params, depends, data }) => {
    const ldjson: any = { '@context': 'https://schema.org' };
    ldjson.issn = '1234-5678';
    return { ldjson };
}
```

### schema-dts

For TypeScript-safe JSON-LD, use `schema-dts` (maintained by Google) to type the `WithContext<Article>`, `Review`, `CreativeWork`, `WebPage` etc. shapes, then assign fields conditionally by template/content type (item vs. links vs. default) before merging with the shared layout data and serializing.

Author's closing note: reviews marked up this way have historically surfaced as rich results in Google search, corroborating that clean, merged JSON-LD (layout-level + page-level) is a working pattern for SvelteKit SSR sites.
