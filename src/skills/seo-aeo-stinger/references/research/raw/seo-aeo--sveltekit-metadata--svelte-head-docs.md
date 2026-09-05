# &lt;svelte:head&gt; - Svelte Docs

- URL: https://svelte.dev/docs/svelte/svelte-head
- Fetched: 2026-08-14
- Source type: official-docs
- Component: sveltekit-metadata

## Notes

`<svelte:head>` makes it possible to insert elements into `document.head`. During server-side rendering, `head` content is exposed separately to the main `body` content.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```

Constraints: as with `<svelte:window>`, `<svelte:document>`, and `<svelte:body>`, this element may only appear at the top level of a component and must never be inside a block or element.

Confirmed elsewhere (svelte.dev/docs/kit/seo, and community sources): during server rendering SvelteKit writes `<svelte:head>` contents into the document head of the HTML response, so a crawler that runs no JavaScript still sees title/description/canonical. The block also updates reactively during client-side navigation.
