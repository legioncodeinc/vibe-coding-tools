# SvelteKit generated tsconfig, PageData, ActionData, PageProps

- URL: https://svelte.dev/docs/kit/types
- Fetched: 2026-08-14
- Source type: Official docs (svelte.dev)
- Component: TypeScript configuration, generated route types

## Content

### The generated tsconfig

A SvelteKit project's own `tsconfig.json` (or `jsconfig.json`) should extend the generated config:

```json
{ "extends": "./.svelte-kit/tsconfig.json" }
```

`.svelte-kit/tsconfig.json` is regenerated on every `svelte-kit sync` (dev server start, build, or manual `svelte-kit sync`) and mixes two categories of options:

**Generated programmatically from project configuration** (should generally not be overridden without good reason):

```json
{
	"compilerOptions": {
		"paths": {
			"$lib": ["../src/lib"],
			"$lib/*": ["../src/lib/*"]
		},
		"rootDirs": ["..", "./types"]
	},
	"include": [
		"ambient.d.ts",
		"non-ambient.d.ts",
		"./types/**/$types.d.ts",
		"../vite.config.js",
		"../vite.config.ts",
		"../src/**/*.js",
		"../src/**/*.ts",
		"../src/**/*.svelte",
		"../tests/**/*.js",
		"../tests/**/*.ts",
		"../tests/**/*.svelte"
	],
	"exclude": [
		"../node_modules/**",
		"../src/service-worker.js",
		"../src/service-worker/**/*.js",
		"../src/service-worker.ts",
		"../src/service-worker/**/*.ts",
		"../src/service-worker.d.ts",
		"../src/service-worker/**/*.d.ts"
	]
}
```

**Required for SvelteKit to work properly** (should also be left untouched unless you know what you're doing):

```json
{
	"compilerOptions": {
		// this ensures that types are explicitly
		// imported with `import type`, which is
		// necessary as Svelte/Vite cannot
		// otherwise compile components correctly
		"verbatimModuleSyntax": true,

		// Vite compiles one TypeScript module
		// at a time, rather than compiling
		// the entire module graph
		"isolatedModules": true,

		// Tell TS it's used only for type-checking
		"noEmit": true,

		// This ensures both `vite build`
		// and `svelte-package` work correctly
		"lib": ["esnext", "DOM", "DOM.Iterable"],
		"moduleResolution": "bundler",
		"module": "esnext",
		"target": "esnext"
	}
}
```

Use the `typescript.config` setting in `svelte.config.js` to extend or modify the generated `tsconfig.json` programmatically (mutate the passed config object, or return a new one). This is documented as useful for extending a shared `tsconfig.json` in a monorepo root. Any paths configured there must be relative to the generated config file's location (`.svelte-kit/tsconfig.json`), not the project root.

### Why `moduleResolution: "bundler"` and not `Node16`/`NodeNext`

From the SvelteKit issue tracker (`sveltejs/kit#9007`, "Change tsconfig/json moduleResolution to bundler"): TypeScript 4.7 added `moduleResolution: "node16"`/`"nodenext"` alongside `module: "node16"`, unlocking `package.json` `exports`/`imports`/self-referencing resolution that the older `"node"` moduleResolution value cannot see (so packages that only declare `types` inside `exports` fail to resolve under plain `"node"`).

The SvelteKit team's own reasoning against `node16`/`nodenext` (quoted from a maintainer in the issue thread): "We won't be changing `moduleResolution` to `next/node16` because it has lots of unpleasant side effects: all relative imports now need the full path and file extension (and it's weird because you need to import TS files with a `.js` ending); not properly built packages will suffer because their types are no longer resolved. Instead we should leverage TypeScript 5.0's upcoming `moduleResolution: "bundler"`." Changing this was called out explicitly as a breaking change for `create-svelte` at the time.

This is the direct explanation for why a SvelteKit app's tsconfig looks different from a Node16-resolution npm library/CLI package: SvelteKit's build is Vite/esbuild-driven (a bundler resolves imports, not Node's own ESM loader at runtime for source files), so `bundler` resolution matches reality and avoids forcing `.js` extensions on relative TS imports. A published npm package with no bundler in front of its runtime consumers is the case where `Node16`/`NodeNext` remains correct (see `raw/` note: this is why Hivemind, an npm-published package, correctly uses `Node16` while a SvelteKit app correctly uses `bundler`).

### `verbatimModuleSyntax` and `isolatedModules`

Both settings exist because Vite (and the Svelte compiler) processes **one file at a time** rather than type-checking across the whole module graph the way `tsc` normally does:

- `isolatedModules: true` - tells TypeScript to flag any construct that cannot be compiled correctly without full-program knowledge (a few cross-file features are disallowed). Required because Vite compiles per-module.
- `verbatimModuleSyntax: true` - forces type-only imports to be written explicitly as `import type { Foo } from './foo'` rather than a plain `import { Foo } from './foo'` that TypeScript would otherwise silently elide at compile time. Svelte/Vite's single-file compilation cannot infer from context alone whether an import is type-only, so the source must say so explicitly. The general Svelte TypeScript doc independently states: "Set `verbatimModuleSyntax` to `true` so that imports are left as-is" and "Set `isolatedModules` to `true` so that each file is looked at in isolation."
- `noEmit: true` - tsconfig is used only for type-checking in a SvelteKit app; Vite (not `tsc`) does the actual compilation to JS.
- `target: "esnext"`, `lib: ["esnext", "DOM", "DOM.Iterable"]` - matches what Vite's dev server and production build both assume, and ensures both `vite build` and `svelte-package` (for library authors publishing Svelte component packages) work correctly against the same config.

Also documented (general Svelte TypeScript guidance, not SvelteKit-specific): use a `target` of at least `ES2015` so classes are not compiled down to functions.

### Generated route types (`./$types`)

For every route file, SvelteKit generates a `.d.ts` under `.svelte-kit/types/` with route-parameter and data types derived directly from the route's actual file-system location, instead of a contributor hand-writing `Params` generics. Example: a route at `src/routes/[foo]/[bar]/[baz]/+server` gets a generated `RouteParams` type:

```ts
type RouteParams = {
	foo: string;
	bar: string;
	baz: string;
};
```

The docs explicitly frame this as solving two problems with hand-written param types: it's cumbersome to write out, and it's non-portable (renaming a route directory like `[foo]` to `[qux]` would silently desync a hand-written type from reality, whereas the generated type updates automatically on `svelte-kit sync`).

### `PageData`, `LayoutData`, `ActionData`, `PageProps`

- The return type of a page's/layout's `load` function is available via `./$types` as `PageData`/`LayoutData` respectively.
- The union of all `Actions` return values in a `+page.server` file is available as `ActionData`.
- `PageData` interface convention: "Defines the common shape of the `page.data` state and `$page.data` store - that is, the data that is shared between all pages. The `Load` and `ServerLoad` functions in `./$types` will be narrowed accordingly. Use optional properties for data that is only present on specific pages. Do not add an index signature (`[key: string]: any`)."
- Since SvelteKit 2.16.0, two helper types reduce boilerplate: `PageProps` (defines `data: PageData` plus `form: ActionData` when actions exist) and `LayoutProps` (defines `data: LayoutData` plus `children: Snippet`). Before 2.16.0 these had to be typed manually:

```svelte
<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData, form: ActionData } = $props();
</script>
```

versus, 2.16.0+:

```svelte
<script lang="ts">
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>
```
