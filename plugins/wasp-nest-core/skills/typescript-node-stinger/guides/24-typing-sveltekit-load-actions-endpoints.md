# 24 - Typing SvelteKit load functions, form actions, and +server.ts endpoints

**Primary context: SvelteKit app on Vercel.** This is the TypeScript-pattern layer around SvelteKit's own routing conventions. Component/markup authoring itself belongs to `svelte-stinger`; this guide covers the surrounding type discipline a TS/Node review should check.

## Always import from `./$types`, never hand-write route types

SvelteKit generates a `.d.ts` per route file under `.svelte-kit/types/`, deriving `RouteParams`, `PageLoad`/`PageServerLoad`/`LayoutLoad`/`LayoutServerLoad`, `PageData`/`LayoutData`, and `Actions`/`ActionData` directly from that route's actual file-system location. Hand-writing an equivalent type (e.g. a manual `{ slug: string }` for a `[slug]` route) is cumbersome and non-portable - rename the route directory and a hand-written type silently drifts from reality, while the generated one updates automatically on the next `svelte-kit sync`. Importing the wrong or a stale hand-rolled type instead of `./$types` is a **should-refactor**, escalating to **must-fix** if it's actively wrong (e.g. missing a param the route actually has).

Source: `references/research/raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md`.

## `load` functions: universal vs server, and how to type them

Two kinds, two different generated types:

- `+page.js`/`+layout.js` - **universal** `load`, runs on server AND browser (unless `export const ssr = false`). Type with `PageLoad`/`LayoutLoad`.
- `+page.server.js`/`+layout.server.js` - **server-only** `load`, gets extra arguments like `cookies`. Type with `PageServerLoad`/`LayoutServerLoad`.

```ts
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	return { user: locals.user };
};
```

Annotating with the wrong generated type (e.g. `PageLoad` on a `+page.server.ts` file) is a **must-fix** - it desyncs `params` typing and the return-value inference from what the file actually receives.

**The server-to-universal handoff is not automatic.** When both a server and a universal `load` exist for the same route, the server load's return arrives as the `data` property on the universal load's event argument - the universal load must explicitly read and re-forward anything it wants to pass through:

```ts
// +page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	return { ...data, extra: 'client-computed value' };
};
```

Assuming a universal `load`'s return value automatically includes the server load's data without this explicit forward is a **must-fix** - the page will silently lose fields.

**Data merging across the layout hierarchy**: when multiple `load` functions in the same request (parent layouts, child layout, page) return overlapping keys, the last one to run wins. A layout returning `{ a: 1, b: 2 }` and a page returning `{ b: 3, c: 4 }` merges to `{ a: 1, b: 3, c: 4 }`. This is a common source of "why did my layout's value get overwritten" confusion - flag it when reviewing a data shape that spans a layout and a page.

**Serialization**: server `load` return values must be `devalue`-serializable (JSON plus `BigInt`/`Date`/`Map`/`Set`/`RegExp`/cyclical references) because they cross the network boundary to the client. A server `load` returning a non-serializable value (a live DB connection, a class instance with methods) is a **must-fix**. Universal `load` functions have no such constraint.

Source: `references/research/raw/sveltekit--load--universal-and-server-load-typing.md`.

## `PageProps`/`LayoutProps` (SvelteKit 2.16.0+)

Prefer the bundled prop types over manually destructuring `data`/`form` individually, once the project's SvelteKit version supports them (2.16.0+):

```svelte
<script lang="ts">
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>
```

`PageProps` includes `form: ActionData` automatically when the route has actions; `LayoutProps` includes `children: Snippet`. On an older SvelteKit version, the manual form (`{ data: PageData, form: ActionData }`) is still correct - check `package.json`'s `@sveltejs/kit` version before flagging the manual form as a finding.

## Form actions

`+page.server.ts` exports `actions: Actions` (also from `./$types`) alongside `load`:

```ts
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => { /* ... */ };

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		// validate with zod, see guides/12-strict-types-and-zod.md
	}
};
```

**Execution order matters for a correctness review**: after an action runs, SvelteKit re-runs the page's `load` functions, and the action's own return value arrives as the `form` prop alongside the re-fetched data. A `handle` hook in `hooks.server.ts` runs BEFORE the action and does **not** re-run afterward - if `handle` populates `event.locals` from a cookie, and the action being reviewed sets or deletes that cookie, `event.locals` inside that same request is stale. Code that relies on `event.locals` reflecting a cookie an action just changed, within the same request, is a **must-fix** - it must read/update what it needs directly instead.

Client-side code deserializing an action's response (e.g. via `use:enhance` or a manual fetch to the action endpoint) must use the deserialize helper from `$app/forms`, not plain `JSON.parse()` - action results support the same `Date`/`BigInt`-inclusive types as `load` results, which raw `JSON.parse` can't reconstruct. A manual `JSON.parse(await res.text())` on an action response is a **must-fix**.

Source: `references/research/raw/sveltekit--form-actions--typing-and-flow.md`.

## `+server.ts` endpoints and `App.Locals`/`App.PageData`

A `+server.ts` file exports HTTP-verb handlers (`GET`, `POST`, etc.) typed against the generated `RequestHandler` type for that route, which carries the same route-derived `RouteParams` typing as `load` functions. `App.Locals` (populated in `hooks.server.ts`'s `handle`, consumed in `load`/actions/`+server.ts` via `event.locals`) and `App.PageData` (the cross-page `page.data` shape read via `$app/state`) are both declared once in `src/app.d.ts` - this is the project's ambient-typing surface, picked up automatically by the generated tsconfig's `include` list. A new global request-scoped value (auth session, tenant ID) that isn't added to `App.Locals` before being read via `event.locals.whatever` is a **must-fix** - it will type as `any` or fail to compile depending on how strict the surrounding code is.

**Known gap**: this pass's research archive does not cover `+server.ts`'s `RequestHandler` generic signature in the same depth as `load`/actions (see `references/research/distilled-typescript-node.md` open gaps). Verify the exact generic shape against live `svelte.dev/docs/kit/types` docs before asserting a specific `RequestHandler<Params, RouteId>` signature is wrong.

## Common findings

- Wrong generated type (`PageLoad` where `PageServerLoad` belongs, or vice versa) - **must-fix**.
- Universal `load` silently dropping server `load` data instead of explicitly forwarding it via `data` - **must-fix**.
- Non-serializable value returned from a server `load` - **must-fix**.
- Action response deserialized with `JSON.parse` instead of the `$app/forms` helper - **must-fix**.
- Code assuming `event.locals` reflects a cookie the current action just changed - **must-fix**.
- A new `event.locals` field not declared in `App.Locals` - **must-fix**.
- Hand-written route param types instead of importing generated ones from `./$types` - **should-refactor**.
- Manual `{ data, form }` destructuring on a SvelteKit 2.16.0+ project where `PageProps`/`LayoutProps` would be cleaner - **style** (not a finding on its own, note only).

## Sources

- `references/research/raw/sveltekit--types--generated-tsconfig-pagedata-actiondata.md`
- `references/research/raw/sveltekit--load--universal-and-server-load-typing.md`
- `references/research/raw/sveltekit--form-actions--typing-and-flow.md`
- `references/research/distilled-typescript-node.md` section 2
