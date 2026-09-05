# 12 - Strict Types & zod

`strict: true` is on. The discipline is: keep types honest internally with strict TS, and validate everything that crosses an external boundary with zod. This guide applies to both contexts this skill covers: the SvelteKit app (primary case) and the Hivemind-shaped npm library/CLI (secondary case, the zod v4/v3 MCP-SDK split below is specific to that case). See the 2026 update section near the end for this repo's actual stack guidance.

## Strict TS

`strict` bundles `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and the rest. The rules that bite in this repo:

- **No `any` at a boundary.** A function parameter or return typed `any` defeats strict mode for everything downstream. Use `unknown` and narrow, or a zod schema for external data. `any` crossing a signature is a **must-fix**.
- **`unknown` in `catch`.** A caught error is `unknown`; narrow with `err instanceof Error` before touching `.message` (`guides/09`).
- **Null-safety is enforced.** `strictNullChecks` means `T | undefined` from an optional must be handled, not assumed away with `!` unless you can prove non-null at that point. A casual `!` on user/IO data is a **should-refactor**.
- **Prefer `unknown` over `any` for genuinely dynamic data**, then narrow with a zod `.parse()` or a type guard.

## zod at every external boundary

External = anything you did not produce in this process: MCP tool input, parsed JSON, environment variables, file contents, third-party API responses (Anthropic, Deep Lake row shapes you do not trust). Validate at entry:

```ts
import { z } from "zod";

const ConfigSchema = z.object({
  apiUrl: z.string().url(),
  workspaceId: z.string().min(1),
  orgId: z.string().min(1),
});

const config = ConfigSchema.parse(JSON.parse(raw)); // throws on bad input, types flow out
```

`z.infer<typeof ConfigSchema>` gives you the static type for free - one schema, one source of truth for both runtime validation and the TS type. A boundary that takes raw `JSON.parse(...)` and trusts it is a **must-fix**.

## The zod major split (the critical detail)

- **The app uses `zod ^4`** (`"zod": "^4.3.6"` in `dependencies`). Import `from "zod"`.
- **The MCP server uses `zod/v3`** (`import * as z from "zod/v3"`) because the MCP SDK's `inputSchema` inference is written against zod v3.

These are two different majors living in one install. The rule: in `src/mcp/server.ts` (and any module feeding the MCP SDK an `inputSchema`), import `zod/v3`; everywhere else, import `zod`. Mixing them in a module that builds an `inputSchema` silently breaks the SDK's type inference - a **must-fix** and the single most common zod footgun here.

## 2026 update: zod vs valibot for THIS repo's stack (SvelteKit primary case)

The zod v4/v3 split above is a Hivemind-specific reason to pick zod (the MCP SDK's `inputSchema` inference couples to zod v3). That reason does not exist in the SvelteKit app - there is no MCP server here. So the zod-vs-valibot question for this stack needs its own answer, grounded in 2026 research rather than carried over from the Hivemind case by habit.

**Current tradeoff (as of 2026-08-14 research)**: Zod v4's bundle-size rewrite (core ~1.8-5KB, down from v3's ~13KB; a `zod/mini` variant at ~3.94-6.88kB for a realistic form) narrowed but did not close the gap with Valibot v1 (~1.37kB for the same form). Runtime performance is now roughly equivalent between the two. Ecosystem support for this stack's actual integration points - tRPC, React Hook Form, Drizzle ORM, TanStack Form, SvelteKit Superforms - is neutral between the two via the Standard Schema spec; there is no MCP-SDK-style forcing function toward zod here the way there is in the Hivemind case.

**This skill's guidance**: default to zod for this app's server-side validation - `+page.server.ts` load functions and form actions, `+server.ts` endpoints, Doppler-sourced env parsing (see `guides/24-typing-sveltekit-load-actions-endpoints.md`) - because nearly all of this app's validation runs server-side, where bundle size is irrelevant and zod's ecosystem depth (40+ built-in i18n locales, broader tooling, team familiarity) wins outright. If a task specifically ships validation logic into a client component or a genuinely edge-deployed function - where bundle bytes actually reach the browser and are measured - evaluate valibot on its own merits for that specific surface, rather than reflexively reaching for zod out of Hivemind-era habit or reflexively reaching for valibot because "it's smaller." Import from `zod` (v4) directly in this app; there is no v3/v4 split to manage here, unlike the MCP server case in `guides/05-mcp-sdk-tools.md`.

A PR introducing valibot for server-side-only validation in this app, with no client-bundle justification, is a **should-refactor** - ask what problem it's solving; if the answer is "bundle size" for code that never ships to a browser, that's not a real justification here. A PR importing `zod/v3` anywhere in this app (as opposed to the Hivemind MCP-server case) is very likely copy-pasted from the wrong context - flag it.

Sources: `references/research/raw/zod-vs-valibot--2026-tradeoffs.md`, `references/research/distilled-typescript-node.md` section 4. The existing `references/zod-vs-valibot.md` remains the Hivemind-era evidence trail for the MCP-SDK-coupling reasoning and is preserved as-is.

## Drizzle boundaries: link, don't duplicate

For zod validation immediately around Drizzle query results/inputs (e.g. validating a form's input before it becomes a Drizzle insert), the type-inference side of that boundary - `$inferSelect`/`$inferInsert`, the relational query builder's typing - is covered in `guides/25-drizzle-type-inference-patterns.md`, not here. This guide owns the zod/valibot validation layer; `guides/25` owns what Drizzle itself infers once validated data reaches the query layer.

## Type guards vs assertions

Prefer a guard (`function isRow(x: unknown): x is Row`) or a zod `.safeParse()` over a cast (`x as Row`). A cast tells the compiler to stop checking; a guard actually checks. A cast on external data is a **should-refactor** (a **must-fix** if it is laundering an `any`).

## Audit script

`scripts/audit-untyped-boundaries.mjs` flags `: any`, `as any`, and exported functions whose parameters take a bare `unknown` / parsed JSON without a zod `.parse` / `.safeParse` nearby. See `scripts/README.md`.

## Common findings

- `any` crossing a function signature - **must-fix**.
- A boundary trusting `JSON.parse(...)` with no zod validation - **must-fix**.
- `from "zod"` (v4) inside the MCP `inputSchema` path instead of `zod/v3` - **must-fix**.
- `as Row` on external data instead of a guard / `safeParse` - **should-refactor**.
- A casual `!` non-null assertion on IO data - **should-refactor**.

## Sources

- `tsconfig.json` (`strict: true`), `package.json` (`zod ^4`), `src/mcp/server.ts` (`zod/v3`) - Hivemind case.
- `research/2026-06-16-zod-v4-vs-v3-mcp.md` - Hivemind case.
- `references/research/raw/zod-vs-valibot--2026-tradeoffs.md` - this repo's SvelteKit-stack update.
- `references/research/distilled-typescript-node.md` section 4.
- `guides/25-drizzle-type-inference-patterns.md` for the adjacent Drizzle inference boundary.
