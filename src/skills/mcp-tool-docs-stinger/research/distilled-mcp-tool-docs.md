# Distilled Research: Tool, API, and CLI Documentation (general)

Generated 2026-08-14. Distills the 8 new source notes in `research/external/` (dated 2026-08-14) plus what still holds from the original 2026-06-16 research pass (`research-summary.md`, `external/2026-06-16-*.md`). This file backs the general-first guide restructure: the guides teach the domain-general practice; the Hivemind material stays as a labeled worked example, not the default case.

Organized around the five things this skill now owns: honest MCP tool documentation, TypeScript API reference generation, CLI documentation conventions, doc-to-code sync, and changelog discipline tied to a released artifact.

---

## 1. Honest MCP tool documentation (name / purpose / schema / output / side effects / examples)

**Reused from the 2026-06-16 pass** (`external/2026-06-16-mcp-tool-resource-documentation.md`): an MCP client selects and calls a tool purely off its name, description, and input schema - those three are the API contract, not descriptive prose layered on top of the real behavior. The honest move is to transcribe the schema field-for-field (type, required/optional, constraints, default, describe text) rather than paraphrase it. This is still the foundation of the six-part tool-doc shape.

**New for 2026-08-14, from the official spec and community practice:**

- **Tool annotations are now part of the contract, not an optional extra.** The `2025-03-26` spec revision added `ToolAnnotations`: `title`, `readOnlyHint` (default `false`), `destructiveHint` (default `true`), `idempotentHint` (default `false`), `openWorldHint` (default `true`). Every field is a *hint* - clients must treat annotations from untrusted servers as untrusted, and a malicious server can lie about them. But for a server whose behavior the documenter can verify against source, annotations are a structured, checkable expression of the same fact a tool doc already states in prose ("read-only" vs. "writes"). A tool doc should record both: the prose side-effect claim, and the annotation values the server actually sets (or "no annotations set - defaults to non-read-only, potentially destructive, open-world" if none are present). A doc that says "read-only" while the server ships no `readOnlyHint` (or ships `destructiveHint: true`) is an internal contradiction worth flagging. Source: `external/2026-08-14-mcp-tool-annotations-risk-vocabulary.md`, `external/2026-08-14-mcp-spec-tools-page.md`.
- **The pessimistic-default posture is itself documentation-relevant.** A tool with no annotations is assumed non-read-only, potentially destructive, non-idempotent, and open-world. When documenting a tool that has no annotations set, say so explicitly and note the default posture a client will assume - don't let the absence of annotations go unremarked.
- **A concrete rubric for the "purpose" and "input schema" sections**, from practitioner convention: a good tool description answers three questions in order - what it does, when to use it (context that prevents wrong tool selection), and what it returns. Constraints belong in the schema (`pattern`, `enum`, `minLength`, `maximum`), not only in prose - a prose-only constraint is a suggestion an agent may not follow, where a schema keyword is enforced at validation time. Tools with no parameters should use `{ "type": "object", "additionalProperties": false }` rather than a bare `{ "type": "object" }`, per the spec's own recommendation. Source: `external/2026-08-14-mcp-tool-schema-design.md`, `external/2026-08-14-mcp-spec-tools-page.md`.
- **Server-side security facts are part of the honest side-effects section.** The spec requires servers to validate inputs, implement access controls, rate-limit invocations, and sanitize outputs. When documenting a tool's side effects, confirm (don't assume) which of these the real handler does - a tool doc that's silent on input validation isn't wrong, but a tool doc that claims validation the handler doesn't perform is.

**The six-part shape stands, generalized:** name, purpose (what/when/returns), input schema (transcribed, with annotation values where set), output shape (including empty/error cases), side effects (prose + annotations), and at least one example. This applies to any MCP server, not just a read-only one - the difference between a read-only server and a writing one is a documented fact, not a different doc shape.

**Worked example:** `examples/hivemind-search-tool-doc.md` still demonstrates the full six-part shape end to end for a real, read-only tool. Read it as the worked case; the general shape above is what to apply to any other MCP server.

---

## 2. TypeScript API reference generation options in 2026

**Reused from the 2026-06-16 pass** (`external/2026-06-16-typedoc-typescript-api-docs.md`): TypeDoc remains the standard for "generate an HTML/JSON API reference directly from TypeScript source and TSDoc comments." It reads the compiler's own type information, so the reference cannot silently contradict the code. `entryPoints`, `excludeInternal`/`excludePrivate`, and `treatWarningsAsErrors` are still the load-bearing config keys; `@param`/`@returns`/`@throws`/`@example`/`@deprecated`/`@internal`/`@see` are still the tags that matter.

**New for 2026-08-14 - TypeDoc is not the only tool in this space, and "TypeDoc alternative" usually means a different problem, not a competitor:**

- **API Extractor (Microsoft)** solves a different problem than TypeDoc: not "generate readable docs" but "enforce and review the public API contract." It produces a `.d.ts` rollup, detects breaking changes between versions, and writes a diffable `api-report.md` that shows up as a PR diff when an exported signature changes - turning "is this a breaking change?" into something code review catches mechanically instead of relying on a human noticing. Teams on Rush/Nx commonly gate releases on API Extractor: if the report changes without a version bump, CI fails. `@internal` in API Extractor is a *publishing* boundary (excluded from the shipped `.d.ts`) distinct from TypeScript's `private` (a compile-time constraint) - useful in monorepos where a symbol needs to stay `public` for cross-package use but invisible to external consumers. Source: `external/2026-08-14-typedoc-vs-jsdoc-vs-api-extractor.md`.
- **The common combined pattern:** TypeDoc for the human-readable HTML/JSON reference, API Extractor for the `.d.ts` rollup and breaking-change gate, both together for a complete publishing setup. Recommend both when the project has external consumers who need both a reference to read and a contract CI can enforce; recommend TypeDoc alone when there's no formal API-review process to plug API Extractor into.
- **"TypeDoc alternative" searches decompose into three different complaints, each with a different fix, not a tool swap:**
  1. *"The output looks dated"* - don't switch generators. TypeDoc emits JSON as well as HTML; keep it as the extractor and hand the JSON to a docs-site generator (Docusaurus, Starlight, Mintlify - route this to `docs-site-stinger`) for presentation.
  2. *"I need something that isn't TypeScript-only"* - JSDoc for plain/mixed JS, TSDoc + API Extractor for a reviewable API surface, DocFX for mixed .NET/TS, Sphinx/pdoc for a Python codebase with a TS client.
  3. *"I want it to explain, not just list"* - no source-driven generator does this (the explanatory prose isn't in the type signature); that's an LLM-augmented authoring pass layered on top, a separate concern from generating an accurate reference.
- **TSDoc is a comment-syntax standard, not a TypeDoc replacement.** TypeDoc, API Extractor, and the TypeScript language service all read TSDoc-formatted comments the same way - adopting TSDoc makes comments portable between those tools, it doesn't substitute for any of them.

**Worked example:** `examples/typedoc-setup.md` still demonstrates a full TypeDoc setup end to end for a real package. It remains the default recommendation for "generate a TS API reference"; reach for API Extractor as a named addition when the ask is "enforce the public API contract" or "catch breaking changes in review," not as a replacement.

---

## 3. CLI documentation conventions

The previous pass had no general CLI-documentation research - guide 03 was written entirely from Hivemind's own `USAGE` string and dispatch, with no vendor-neutral grounding. This is genuinely new territory.

- **Help text is the one documentation surface that structurally cannot drift from the tool it documents**, because it ships inside the binary and versions with it - there may be no repo, no README, and no source tree available once a CLI is installed standalone. The practical design/documentation loop this produces: hand the tool nothing but `--help`, watch for the point where a cold reader (human or agent) picks a plausible-but-wrong command, and fix the help text (or the underlying design) until a cold read lands correctly. "Plausible-but-wrong" - a command that runs without erroring but returns believable, incorrect output - is the failure mode worth designing against, because there's no error to signal something went wrong. Source: `external/2026-08-14-cli-help-text-source-of-truth.md`.
- **Concrete techniques that generalize to any CLI reference this skill documents:**
  - Name the wrong choice explicitly when two commands could be confused, not just describe the right one (e.g., state plainly that `search TYPENAME` is not equivalent to `show -t TYPENAME`, and why).
  - Document every default explicitly - never leave one implied, especially where two documented defaults could appear to contradict each other unless both are stated precisely.
  - Confirm destructive/interactive commands have a documented non-interactive flag (`-y`/`--yes`) - a blocking prompt with no way to skip it is a hung agent (and a bad scripting experience for a human).
  - Confirm ambiguous or incomplete input produces a loud, clear error rather than a silently guessed default - a guessed default produces results that look correct, which is the same plausible-but-wrong failure mode as a bad command choice.
- **Concise help vs. full help vs. web documentation are three different surfaces with different jobs**, per the widely cited Command Line Interface Guidelines (clig.dev):
  - *Concise help* (shown on `-h`/no args when the command needs arguments): a one-line description, one or two example invocations, common flags, and a pointer to `--help` for more.
  - *Full help* (`--help`, `-h`, or a `help` subcommand): the complete flag/command reference, generated from the same argument-parsing definitions so it cannot drift from what the parser accepts.
  - *Documentation* (a docs site or man page): the detail help text has no room for - what the tool is for, what it *isn't* for, how it works, edge cases.
  - Lead with examples in help text - users reach for a worked example before any other form of documentation. Put common flags/commands first, not alphabetically. Never pipe help through a pager by default (strands users who don't know how to scroll or exit it). Source: `external/2026-08-14-command-line-interface-guidelines.md`.
  - **Man pages are still a real, checked surface** (`man mycmd` is many users' reflexive first step) - and the pattern of exposing the same content through the tool itself (`npm help ls` == `man npm-ls`) matters more than the man page format specifically, since not every platform has `man` and not every user knows to check it.
  - Use an argument-parsing library rather than a hand-rolled parser where the language ecosystem has one (docopt cross-platform, argbash for Bash, Cobra/urfave-cli for Go) - it keeps flag parsing and generated help text consistent by construction, the same "generate from the same source" principle TypeDoc applies to TS types.
- **docopt-style help-as-source-of-truth**: rather than writing a parser and a help string that has to be kept in sync with it by hand, docopt derives the parser *from* a formalized help message - the help text is the grammar, not a description of the grammar. This is the strongest version of "the reference is source-derived, not hand-forked" applied to CLIs specifically, the same principle TypeDoc applies to types and this skill already applies to MCP tool schemas.

**Applies to any CLI this Bee documents**, not just one with a `USAGE` string dispatch pattern. When the target CLI does use a `USAGE`-constant-plus-dispatch pattern (as Hivemind's does), transcribe from that source as before - it's simply one concrete implementation of "generate/derive help text from the same place the parser reads."

**Worked example:** `examples/hivemind-cli-reference.md` remains the worked case for transcribing a real dispatch-based CLI into a reference; it demonstrates the general principles above applied to one real CLI.

---

## 4. Doc-to-code sync

**Reused from the 2026-06-16 pass and unchanged in principle:** docs drift the moment code changes; the only docs that stay honest are the ones a machine re-checks. The existing CI-gate template (grep tool names out of source, diff changelog version against `package.json`) is a valid, minimal hand-rolled implementation of this principle.

**New for 2026-08-14:** a mature category of purpose-built tooling now exists for exactly this problem in TypeScript codebases, worth naming as an off-the-shelf option alongside the hand-rolled template rather than reinventing it every time:

- Tools in this category (e.g., `drift`, and the same pattern in `docs-drift`, `doc-sync-check`, `docgap`) extract the real, current API surface via AST/type analysis, then diff documentation (JSDoc/TSDoc comments and markdown) against it, flagging structural drift (a signature that no longer matches its doc), semantic drift (deprecation/visibility mismatches, broken cross-references), example drift (an `@example` block that no longer runs), and prose drift (markdown referencing an export that no longer exists). Findings carry file/line locations so a fix - human or agent-driven - is fast. Source: `external/2026-08-14-typescript-docs-drift-detection.md`.
- The adoption pattern generalizes: run a full scan locally, set a coverage/quality baseline, then gate CI on that baseline (`drift ci --all --min 80` or equivalent) so new drift fails the build rather than merging silently - the same shape as the existing `templates/docs-sync-workflow.yml`, just with a purpose-built tool doing the AST-diffing instead of `grep`.

**Guidance:** for a small surface (a handful of MCP tools, a CLI with one dispatch file), the hand-rolled grep/diff CI gate already in this skill's template is proportionate and has no new dependency. For a TypeScript package with a real exported API surface and multiple contributors, recommend a dedicated drift-detection tool as the more maintainable option and name the category, without mandating a specific product.

---

## 5. Changelog discipline tied to a released artifact

**Reused from the 2026-06-16 pass, generalized:** the core discipline - the changelog tracks *released versions* of a real artifact, not arbitrary dates; breaking changes get a `[BREAKING]` (or equivalent) tag with migration guidance; the version at the top of the changelog must equal the version the artifact actually ships. Hivemind's specific mechanism (`scripts/sync-versions.mjs` single-sourcing `package.json` across manifests) is one concrete implementation of "the version is single-sourced" - the principle generalizes to any released artifact (an npm package, a CLI binary, an API, a plugin) that has *a* canonical version field somewhere, even if the propagation mechanism differs.

**New for 2026-08-14 - the format convention and the automation layer, named explicitly:**

- **Keep a Changelog** is the widely adopted format convention this skill's existing impact-first template already resembles: group by change type (Added, Changed, Deprecated, Removed, Fixed, Security), newest version first, one entry per released version, state whether the project follows semver, and keep an `Unreleased` section at the top for changes not yet cut into a version. Its core argument for writing a changelog by hand (or reviewing a generated one) rather than treating commit history as the changelog: "changelogs are for humans, not machines" - commit logs are full of noise (merge commits, doc-only commits, obscure titles) that a changelog's job is to filter out, surfacing the *noteworthy* difference across possibly many commits. GitHub Releases are explicitly not a substitute for a versioned `CHANGELOG.md` - they're non-portable and less discoverable than a top-level file next to `README`/`CONTRIBUTING`. Source: `external/2026-08-14-keep-a-changelog.md`.
- **Automated changelog generation from Conventional Commits** is the other half, for projects that want the changelog (and the version bump) derived mechanically rather than written by hand each release:
  - **Conventional Commits** is the commit-message convention this tooling category depends on: `fix:` -> patch, `feat:` -> minor, a `!` after the type/scope or a `BREAKING CHANGE:` footer -> major.
  - **semantic-release** fully automates the release workflow end to end from commit messages: determines the next version, generates release notes, publishes - removing the "human emotion in a version number" step entirely, strictly following semver and communicating impact to consumers via the commit convention.
  - **release-please** (Google) takes a lighter-touch approach: it opens a release PR that updates the changelog and version files based on Conventional Commit history, leaving a human to review and merge rather than auto-publishing.
  - **conventional-changelog** is the underlying library both of the above (and standalone CLI usage) build on: it reads git history, groups commits into changelog sections by their Conventional Commits type, and writes (or prepends to) `CHANGELOG.md`.
  - Choosing between "write the changelog by hand per release" and "generate it from Conventional Commits": hand-written entries can be impact-first and migration-focused (this skill's existing template); generated entries are only as good as commit-message discipline across the whole team, but scale better and remove the "forgot to update the changelog" failure mode. Recommend automation when commit hygiene is already enforced (e.g., via commitlint) and the team wants zero-effort releases; recommend hand-written, impact-first entries (this skill's existing default) when the audience needs migration guidance the commit message alone won't carry.

**The version-single-sourcing and `[BREAKING]`-tagging discipline this skill already teaches is compatible with both paths** - a project using semantic-release still needs its `!`/`BREAKING CHANGE:` commits to carry real migration guidance in the commit body for the generated notes to be useful, which is the same impact-first discipline this skill's template already enforces by hand.

**Worked example:** `examples/changelog-entry.md` remains the worked case for a hand-written, impact-first entry tied to a real version bump (Hivemind's `sync-versions` mechanism). It demonstrates one concrete version-single-sourcing implementation; the general principle - and the automated-generation alternative - is what generalizes to other artifacts.

---

## Cross-links (territory this skill does not own)

- **Writing quality of the prose itself** (Diataxis mode, inverted pyramid, voice/tone, is-this-well-written review) -> `technical-writing-craft-stinger`. This skill transcribes facts from source honestly; it does not own prose craft review.
- **OpenAPI/REST API documentation** (Swagger UI/Redoc/Scalar/Mintlify renderer selection, OpenAPI spec example enrichment, REST SDK generation from an OpenAPI spec) -> `api-docs-stinger`. This skill's TypeScript-API and CLI surfaces are not OpenAPI surfaces; a project with both a REST API and a TS SDK needs both skills, cross-linked, not one skill owning both.
- **Docs-site platform and hosting** (Docusaurus/Starlight/Mintlify/GitBook selection, docs-as-code CI for a whole site, search setup) -> `docs-site-stinger`. This skill's TypeDoc/API Extractor output is often *published inside* one of those sites; picking and running the site itself is out of scope here.

## Verify-live items

- Re-check the current annotation set against the live MCP spec each session - the 2026-08-14 source notes a live SEP process extending annotations (`sensitiveHint`, `egressHint`, `reversibleHint`); the four-field set documented here may have grown by the time this is read.
- Re-verify TypeDoc and API Extractor config keys against the installed versions' own docs before configuring either.
- The Hivemind-specific facts (its three read-only tools, its CLI surface, `sync-versions.mjs`) still need re-reading from source each session per the original research - this distillation does not change that discipline, it generalizes what surrounds it.
