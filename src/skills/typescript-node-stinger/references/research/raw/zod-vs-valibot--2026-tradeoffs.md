# zod vs valibot: 2026 tradeoffs (bundle size, ecosystem, API)

- URL: https://toolchew.com/en/zod-vs-valibot/
- Fetched: 2026-08-14
- Source type: Blog / comparison guide (independent, versioned and dated, cites Bundlephobia measurements)
- Component: Validation library selection

## Content

### Version pins for this comparison

Zod v4.4.3 (released May 4, 2026) vs Valibot v1.4.0 (released May 5, 2026). Both actively maintained, zero-dependency, MIT-licensed.

### At-a-glance numbers

| Metric | Zod v4.4.3 | Valibot v1.4.0 |
|---|---|---|
| Monthly downloads | ~595M | ~32.9M |
| GitHub stars | 42,732 | 8,690 |
| Full bundle (gzip) | 60.3 KB | 14.4 KB |
| Typical login-form bundle (esbuild, tree-shaken) | ~17.7 kB | ~1.37 kB |
| API style | Chained OOP | Functional composition (`v.pipe()`) |
| Tree-shaking | Partial (Zod Mini variant is fully tree-shaken) | Excellent by design |
| TypeScript requirement | v5.5+ strict | v5+ |

The bundle-size gap is described as "the only axis where one decisively beats the other" - both validate correctly, both have full TS inference, both support async validation, both have brand types, both are zero-dependency.

### Why the gap shrank but didn't close

Zod v3's bundle was ~13KB minimum and effectively un-tree-shakeable due to its class-based chained-method API pulling in the full prototype chain on any import. Zod v4 (2025 rewrite) cut this to a ~1.8-5KB core depending on measurement method, and added **Zod Mini** (`import { z } from "zod/mini"`), a pipe-based functional API mirroring Valibot's style specifically to close the tree-shaking gap - Zod Mini measures ~3.94-6.88kB for a realistic form schema depending on bundler (esbuild vs Rolldown). Valibot's per-validator standalone-function design still wins at ~1.37kB for the same realistic form, because each validator (`v.string()`, `v.email()`, `v.minLength()`) is bundled independently with zero shared prototype overhead.

Practical framing: "On a Node.js API server, a 16 kB difference is invisible - a cold-start rounding error. On a Cloudflare Worker with tight CPU-time limits, or in a Next.js client component where every kilobyte affects Time to Interactive, it matters."

### Runtime performance

Zod v4 is a ground-up rewrite: 14.71x faster string parsing, 7.43x faster array parsing, 6.5x faster object parsing vs Zod v3. Valibot v1 has similar runtime throughput to Zod v4 now - Valibot's older "roughly 2x faster than Zod v3" advantage is gone since Zod v4 closed that gap. For genuinely hot-loop validation needing AOT-compiled speed, neither library is the right tool - TypeBox or Typia are named as the actual answer there. Zod v4 also cut TypeScript compilation time significantly (a "100x reduction in type instantiation count vs v3"), which matters for `tsc` speed on large schema files in a big monorepo.

### API shape differences (both current, both fully typed)

```ts
// Zod v4
import { z } from "zod"
const UserSchema = z.object({ name: z.string(), age: z.number().int() })
const user = UserSchema.parse(input)          // throws ZodError
const result = UserSchema.safeParse(input)     // { success, data } | { success: false, error }

// Valibot v1
import * as v from "valibot"
const UserSchema = v.object({ name: v.string(), age: v.pipe(v.number(), v.integer()) })
const user = v.parse(UserSchema, input)        // throws ValiError
const result = v.safeParse(UserSchema, input)  // { success, output } | { success: false, issues }
```

Key surface differences: Valibot uses standalone functions (`v.parse(schema, input)`); Zod uses methods on the schema object (`schema.parse(input)`). Valibot's success shape uses `.output`; Zod uses `.data`. Zod has a `coerce` namespace (`z.coerce.number()`); Valibot has no equivalent namespace and instead composes an explicit `v.transform()` step in the pipe. Brand types work equivalently in both (`z.string().brand<"UserId">()` vs `v.pipe(v.string(), v.brand("UserId"))`) with zero runtime cost either way.

### Ecosystem: Standard Schema neutralized most framework decisions

Any framework or library that adopted the Standard Schema spec treats Zod, Valibot, ArkType, and TypeBox interchangeably. Confirmed via Standard Schema for: tRPC, React Hook Form (`@hookform/resolvers`), Drizzle ORM (both built into `drizzle-orm` core), TanStack Form, Hono, Vercel AI SDK, SvelteKit Superforms. **The one documented exception is Astro Actions** - Astro bundles `astro/zod` as a dependency with no official Valibot adapter as of May 2026, so Zod is the path of least resistance specifically for Astro projects. For SvelteKit specifically (Superforms), both adapters are available and the choice is neutral from a framework-support standpoint.

### Error messages and i18n

Zod v4 ships `z.flattenError()`, `z.treeifyError()`, `z.prettifyError()` for structured/human-readable error output, plus built-in i18n via `zod/locales` covering 40+ languages (`import { de } from "zod/locales"; z.config(de())`). Valibot v1 has a `flatten(issues)` utility and a community `@valibot/i18n` package with fewer locales than Zod's built-in set (described as "growing"). If a project needs i18n error messages without adding a separate dependency, this is a genuine Zod advantage.

### Verdict framing (applicable to a SvelteKit-on-Vercel app)

"Server-side or Node.js - bundle size is irrelevant; stay with the dominant ecosystem choice" -> Zod. "Edge, browser, or greenfield" where bundle bytes reach the client (client components, edge functions) -> Valibot is worth evaluating, with a documented automated codemod/migration path (import swap, method-chain-to-`v.pipe()` restructuring, a rename table for functions like `and`->`intersect`, `catch`->`fallback`, `enum`->`picklist`) callable if a team changes its mind later. For a SvelteKit app where most validation runs in `+page.server.ts`/`+server.ts` (server-only, never shipped to the client bundle), the bundle-size argument for Valibot does not apply; it applies specifically to validation code that ships into a client component or a genuinely edge-deployed function.
