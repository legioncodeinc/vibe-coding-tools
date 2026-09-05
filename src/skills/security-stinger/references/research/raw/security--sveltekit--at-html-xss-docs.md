# {@html ...} - Svelte Docs

- URL: https://svelte.dev/docs/svelte/%40html
- Fetched: 2026-08-14
- Source type: official framework documentation
- Component: Svelte 5 templating (`{@html ...}` tag), SSR XSS surface

## Content

- `{@html content}` injects raw HTML into a component's output.
- Official warning, verbatim: "Make sure that you either escape the passed string or only populate it with values that are under your control in order to prevent XSS attacks. Never render unsanitized content."
- The expression must be valid standalone HTML; splitting a single element's opening and closing tags across two separate `{@html ...}` calls does not work and will not compile as Svelte markup.
- Content rendered via `{@html ...}` is invisible to Svelte's scoped-style system - it will not receive component-scoped CSS, so styling it requires the `:global(...)` modifier, meaning any CSS targeting `{@html}` content is necessarily broader in scope (relevant for style-injection-adjacent concerns, not just script injection).
- Because this renders during SSR as well as client-side, unsanitized content passed to `{@html}` in a `+page.svelte` fed by server `load` data is a server-side-render XSS vector: the malicious markup is present in the initial HTML response before any client-side JS runs, so it executes even for users with JS disabled or before hydration completes, and it will also be picked up by non-browser HTML fetchers/scrapers.
- The only sanctioned uses of `{@html}` are (a) content that has been through a sanitizer (e.g. DOMPurify) immediately before render, or (b) content the application fully controls and that never contains user-influenced substrings.
