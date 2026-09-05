# Payload CMS SEO Plugin (docs + install guide)

- URL: https://payloadcms.com/docs/plugins/seo ; https://github.com/payloadcms/payload/blob/3.x/docs/plugins/seo.mdx ; https://payloadcms.com/posts/guides/how-to-install-and-configure-the-payload-seo-plugin-nextjs-app ; https://github.com/payloadcms/payload/blob/0ceba020/packages/plugin-seo/src/index.ts
- Fetched: 2026-08-14
- Source type: official-docs
- Component: payload-cms

## Notes

`@payloadcms/plugin-seo` manages SEO metadata for an application from within the Payload Admin Panel. Enabled on Collections and Globals, it adds a `meta` field group containing `title`, `description`, and `image` by default. The front-end application reads this data to render meta tags however it needs (e.g. inject `meta.title` into `<title>`).

Editors get an "auto-generate" option per field that runs custom generator functions you supply (`generateTitle`, `generateDescription`, `generateImage`, `generateURL`) -- e.g. append the site name to the title, use an excerpt field as the description, or call a third-party API to generate an image. A live search-engine-result preview renders beneath the fields, with character counters for title/description.

### Plugin config

```ts
seoPlugin({
  collections: ['posts', 'pages'],   // slugs to enable SEO on
  globals: ['settings'],             // globals to enable SEO on
  uploadsCollection: 'media',        // enables the meta.image field
  generateTitle: ({ doc }) => doc.title,
  generateDescription: ({ doc }) => doc.excerpt,
  generateImage: ({ doc }) => doc.featuredImage,
  generateURL: ({ doc, collectionSlug }) => `https://example.com/${collectionSlug}/${doc.slug}`,
  tabbedUI: true,     // renders SEO fields in their own admin tab
  interfaceName: 'SEOFields',
})
```

Enabled collections/globals receive a `meta` object field (group) with `title`, `description`, `image` subfields. Custom fields can be injected into the `meta` group (e.g. `og:title`, `json-ld`) via the plugin's `fields` function.

### Direct field imports (for custom layouts)

```ts
import {
  MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField,
} from '@payloadcms/plugin-seo/fields'
```

These can be dropped directly into a collection's own field array (e.g. inside a `tabs` field) instead of relying on the plugin's default field grouping -- useful when a tabbed SEO UI or custom field order is required. `MetaTitleField`/`MetaDescriptionField`/`MetaImageField` accept `hasGenerateFn` (wires the "auto-generate" button to the configured generator) and `overrides` (e.g. to change `minLength`/`maxLength`). `PreviewField` and `OverviewField` take `titlePath`/`descriptionPath`/`imagePath` to point at the field paths carrying the actual data (`meta.title`, `meta.description`, `meta.image`).

### Plugin internals (source, `packages/plugin-seo/src/index.ts`)

The plugin registers four POST endpoints under the Payload API for the "auto-generate" buttons: `/plugin-seo/generate-title`, `/plugin-seo/generate-description`, `/plugin-seo/generate-url`, `/plugin-seo/generate-image`. Each calls the corresponding configured generator function server-side and returns `{ result }`. It also injects the `meta` group field into every enabled collection's field array (optionally as its own tab if `tabbedUI` is set), and does the same for enabled globals.

### Front-end consumption

Because the plugin is Payload-side only, a SvelteKit front end consumes the resulting `meta` object exactly like any other Payload document field: fetch the document over REST (`GET /api/<collection>/<id-or-where-query>`) in a `+page.server.ts` load function, then bind `doc.meta.title`, `doc.meta.description`, and an absolute `doc.meta.image` URL into `generateSEO()`/`svelte:head` and JSON-LD builders. There is no SvelteKit-specific Payload SEO adapter; the `meta` group is plain JSON returned by the REST/GraphQL API regardless of front-end framework.
