# TypeDoc vs JSDoc vs API Extractor 2026

- URL: https://www.pkgpulse.com/guides/typedoc-vs-jsdoc-vs-api-extractor-2026
- Published: 2026-03-09
- Fetched: 2026-08-14
- Source type: comparison guide / industry blog
- Component: TypeScript API reference generation - tool selection beyond TypeDoc

## The three tools solve different problems

- **TypeDoc** (~3M weekly downloads) generates HTML documentation directly from TypeScript types and JSDoc/TSDoc comments. The standard choice for publishing a TypeScript library's API reference. Reads the compiler's type information, so the docs cannot silently contradict the types.
- **JSDoc** (~5M weekly downloads) is the language-agnostic comment standard both TypeDoc and API Extractor read, plus a standalone HTML generator for plain-JavaScript projects.
- **API Extractor** (Microsoft, ~15M weekly downloads) is not a docs-only tool - it generates the canonical public API surface (a `.d.ts` rollup), detects breaking changes between versions, and produces reviewable `api-report.md` files. It solves "enforce the public API contract," not "generate readable docs."

## Feature comparison

| Feature | TypeDoc | JSDoc (standalone) | API Extractor |
|---|---|---|---|
| HTML documentation | Yes (rich) | Yes (basic) | No |
| TypeScript-native | Yes | No (comment-based) | Yes |
| `.d.ts` rollup | No | No | Yes |
| Breaking-change detection | No | No | Yes |
| API reports (diffable in PR review) | No | No | Yes |
| `@alpha`/`@beta`/`@internal` support | Yes | No | Yes |
| Plugin ecosystem | Rich | Some | None |

## The common combined pattern for npm library authors

```
TypeDoc         -> HTML docs hosted on GitHub Pages
API Extractor   -> .d.ts rollup + api-report.md in git (breaking-change detection)
Both together   -> a complete library-publishing setup
```

`api-report.md` is checked into version control. When a contributor changes a function signature or adds/removes an export, the changed report shows up as a diff in the pull request - breaking changes become visible in code review instead of being discovered by downstream consumers after release. Teams on Rush or Nx often gate releases on API Extractor: if the report would change without a version bump, CI fails. This enforces semver discipline mechanically instead of relying on someone remembering "this is breaking."

## `@internal` means something different in API Extractor than `private`

TypeScript's `private` is a compile-time constraint. API Extractor's `@internal` is a *publishing* constraint: a method can stay `public` at the TypeScript level (so other packages in a monorepo can call it) while being excluded from the `.d.ts` file shipped to npm consumers. This distinction matters for monorepos where internal packages need cross-package access to symbols that should be invisible externally.

## "TypeDoc alternative" is usually one of three different complaints, not a real competitor search

1. **"The output looks dated."** Don't switch generators - TypeDoc emits JSON as well as HTML, so keep it as the extractor and hand the JSON to a docs-site generator (Docusaurus, Starlight, Mintlify) for presentation. Route this concern to `docs-site-stinger`, not a new TS-doc tool.
2. **"I need something that isn't TypeScript-only."** Use JSDoc for plain/mixed JS, TSDoc + API Extractor for a reviewable API surface, DocFX for mixed .NET/TS, Sphinx/pdoc for a Python codebase with a TS client.
3. **"I want it to explain, not just list."** No source-driven generator (TypeDoc included) does this - the explanatory prose isn't in the type signature. That's the domain of LLM-augmented tools (Mintlify Writing Agent, Qodo, etc.), a separate concern from generating an accurate reference.

Also worth naming precisely: **TSDoc is not a TypeDoc replacement.** It's a comment-syntax standard that TypeDoc, API Extractor, and the TypeScript language service all read the same way - adopting TSDoc makes comments portable between those tools, it doesn't replace any of them.

## Applicability to this skill

TypeDoc remains the right default for "generate an HTML/JSON API reference from TypeScript source," which is what the existing guide already teaches. The genuinely new material worth adding: API Extractor as the complementary tool when the goal shifts from "readable docs" to "enforce and review the public API contract" (breaking-change detection via `api-report.md`, `.d.ts` rollups, `@internal` as a publishing boundary in monorepos). A team documenting a TypeScript package should know both exist and pick based on which problem they have - and can run both together.
