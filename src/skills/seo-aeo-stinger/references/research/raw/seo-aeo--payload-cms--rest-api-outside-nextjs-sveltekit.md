# Payload REST API overview + Using Payload outside Next.js (SvelteKit)

- URL: https://payloadcms.com/docs/rest-api/overview ; https://github.com/payloadcms/payload/blob/main/docs/local-api/outside-nextjs.mdx ; https://github.com/payloadcms/payload/discussions/687
- Fetched: 2026-08-14
- Source type: official-docs
- Component: payload-cms

## Notes

The Payload REST API is a fully functional HTTP client for CRUD on Documents, with automatic pagination, `depth`, and sorting. All routes are mounted under the config's `routes.api` segment (default `/api`). Example: a `pages` collection is queryable at `/api/pages`.

Payload publishes an official `@payloadcms/sdk` package for fully type-safe querying of the REST API from any framework:

```ts
import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from './payload-types'

const sdk = new PayloadSDK<Config>({
  baseURL: 'https://example.com/api',
})
```

It supports auth, typed `select`/`populate`/`joins`, a custom `fetch` implementation, and a `baseInit` for shared `RequestInit` properties (e.g. `credentials: 'include'`).

Payload's official docs explicitly state: "Payload can be used completely outside of Next.js which is helpful in cases like running scripts, using Payload in a separate backend service, or using Payload's Local API to fetch your data directly from your database in other frontend frameworks like SvelteKit, Remix, Nuxt, and similar." This confirms SvelteKit is an officially acknowledged consumption target, though the guidance is for the Local API (same-process) case; the REST API is the correct integration surface when SvelteKit runs as a separate app/deployment from Payload (as in the `apps/web` + `apps/cms` split architecture), since the Local API requires an in-process Payload instance.

### Community SvelteKit example (GitHub discussion #687)

An early adopter posted a working `+page` load pattern fetching a Payload `pages` collection by slug:

```js
export async function load({ fetch, params }) {
	const slug = params?.slug || 'home';
	const response = await fetch(`${env.payload_url}/api/pages?where[slug][equals]=${slug}`);
	const data = await response.json();
	if (!data.docs.length) return { status: 404 };
	return { status: response.status, props: { page: response.ok && data.docs[0] } };
}
```

Query pattern confirmed: Payload REST API filters use bracket-notation query params, `where[<field>][<operator>]=<value>`, e.g. `where[slug][equals]=my-post` or `where[status][equals]=published`. Responses are paginated envelopes: `{ docs: [...], totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage }`.

Multiple production teams in that thread reported running Payload and a Svelte front end as two separate deployed services, communicating purely over the REST API -- validating the split-deployment (`apps/cms` on Vercel + `apps/web` SvelteKit on Vercel) architecture rather than requiring a merged Node server.
