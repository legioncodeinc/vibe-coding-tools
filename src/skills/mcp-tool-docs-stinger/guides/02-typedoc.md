# 02 - TypeScript API Reference Generation

Generating a TypeScript public API reference from source, and, where the project needs a reviewable, diffable public-API contract, enforcing that contract in CI. Read `research/distilled-mcp-tool-docs.md` (section 2) before running this guide - it covers what TypeDoc alone does not, and when to reach for a second tool.

## What counts as the public API

Document the **exported** symbols a consumer of the package (or an in-repo module boundary) would actually call: exported functions, classes, types, interfaces, and enums. Internal helpers and unexported symbols stay out of the reference - mark them `@internal` if the generator would otherwise pick them up.

Pick the entry points deliberately. The public surface is the set of modules you choose to expose, not "every `.ts` file in the source tree."

## Tool choice: TypeDoc, API Extractor, or both

These solve different problems - pick based on which one the request is actually asking for, not by habit:

| Need | Tool |
|---|---|
| A readable HTML/JSON API reference generated from TS types + doc comments | **TypeDoc** |
| A reviewable, diffable public-API contract - detect breaking changes in PR review, produce a clean `.d.ts` rollup | **API Extractor** (Microsoft) |
| Both: docs to read *and* a breaking-change gate | **Both together** - this is the common pattern for npm library authors |
| A plain-JavaScript or mixed JS/TS project | **JSDoc** standalone (TypeDoc and API Extractor both read JSDoc/TSDoc comments too) |

TypeDoc reads the same types the compiler enforces, so its reference can never contradict the code - that's the core reason to generate rather than hand-write a public-API reference at all. API Extractor goes further for library authors: it produces `api-report.md`, a file checked into version control that shows a diff in the pull request whenever an exported signature changes, so a breaking change is visible in code review instead of discovered by a downstream consumer after release. Teams on Rush or Nx frequently gate releases on API Extractor: if the report would change without a corresponding version bump, CI fails.

`@internal` means something different in the two tools: TypeScript's `private` is a compile-time constraint; API Extractor's `@internal` is a *publishing* constraint - a symbol can stay `public` in TypeScript (so other packages in a monorepo can call it) while being excluded from the `.d.ts` shipped to external consumers.

**If the request is "TypeDoc's output looks dated," don't switch generators.** TypeDoc emits JSON as well as HTML; the fix is to keep TypeDoc as the extractor and hand its JSON to a docs-site generator for presentation (Docusaurus, Starlight, Mintlify) - route that half of the work to `docs-site-stinger`, not a new TS-doc tool.

## Install and configure TypeDoc

```bash
npm install --save-dev typedoc
```

Create `typedoc.json` at the repo root (full template in `templates/typedoc-json.md`):

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "excludeInternal": true,
  "excludePrivate": true,
  "readme": "none",
  "tsconfig": "tsconfig.json"
}
```

- `entryPoints` - the public modules. Use the package's real entry, not a wildcard, so internal modules do not leak into the reference.
- `excludeInternal` / `excludePrivate` - keep `@internal` and `private` members out.
- `readme: "none"` - the API reference is the reference; README ownership belongs to `readme-writing-worker-bee`.

## npm script

```json
{
  "scripts": {
    "docs:api": "typedoc"
  }
}
```

Run `npm run docs:api`. Output lands wherever `out` points.

## Doc-comment conventions (TSDoc)

Both TypeDoc and API Extractor read TSDoc-formatted comments - adopting TSDoc makes the comment portable between the tools; it is not a replacement for either. Fix the comment at the source; never fork the prose into a separate file.

```ts
/**
 * One-line summary of what this does.
 *
 * @param input - What it means and any constraints.
 * @returns What the caller gets back.
 * @throws When and why.
 */
export async function example(input: string): Promise<Result> { ... }
```

Useful tags:

- `@param`, `@returns`, `@throws` - the call contract.
- `@example` - a runnable snippet; the generator renders it as a code block.
- `@deprecated` - marks a symbol deprecated in the rendered reference; pair with a changelog entry.
- `@internal` - excludes a symbol from the public reference.
- `@see` / `{@link ...}` - cross-link to related symbols.

## If the request needs API Extractor too

For projects that want a reviewable public-API contract on top of the generated reference:

1. `npm install --save-dev @microsoft/api-extractor`.
2. Configure `api-extractor.json` pointing at the package's `.d.ts` entry.
3. Run it in CI; check the generated `api-report.md` into version control.
4. Gate the release: if `api-report.md` would change without a matching version bump, fail the build.

This is additive to TypeDoc, not a replacement - the two commonly run side by side in a single publishing setup.

## Keeping it honest

- The reference is **generated**. If it is wrong, the doc comment in the `.ts` file is wrong - fix it there and regenerate.
- Run the generator in CI and fail the build on warnings (TypeDoc's `treatWarningsAsErrors`), so a new exported symbol without a doc comment is caught.
- Do not check the generated output into review as hand-edited - it is a build artifact.
- If the repo is not TypeScript-only, don't force TypeDoc onto it: JSDoc for plain/mixed JS, DocFX for mixed .NET/TS, Sphinx/pdoc for a Python codebase with a TS client.

---

## Worked example: TypeDoc for Hivemind

`examples/typedoc-setup.md` is a complete, worked TypeDoc setup for a real package: Hivemind (`@deeplake/hivemind`, TypeScript `^6`, ESM, Node `>=22`, built with `tsc` + `esbuild`). It walks install, config, doc comments, generation, and the CI gate end to end for that package's public API (`src/index.ts` as the deliberate entry point). If you are documenting Hivemind's TS API specifically, start there.

*Source: `research/distilled-mcp-tool-docs.md` (section 2); `research/external/2026-06-16-typedoc-typescript-api-docs.md`; `research/external/2026-08-14-typedoc-vs-jsdoc-vs-api-extractor.md`.*
