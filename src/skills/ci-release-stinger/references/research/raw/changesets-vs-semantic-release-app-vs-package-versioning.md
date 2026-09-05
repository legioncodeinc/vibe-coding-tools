# Changesets vs semantic-release, and when an app repo needs versioning at all

- URL: https://github.com/changesets/changesets/blob/main/docs/decisions.md ; https://github.com/changesets/changesets/blob/main/docs/versioning-apps.md ; https://latchkey.dev/learn/tool-comparisons/changesets-vs-semantic-release ; https://brianschiller.com/blog/2023/09/18/changesets-vs-semantic-release/
- Fetched: 2026-08-14
- Source type: Official Changesets repo docs + independent technical blog comparisons (latchkey.dev 2026-06-26, brianschiller.com 2023 - older but the mechanical comparison it documents is still structurally accurate and widely cited; treated as directional/informed opinion, not official)
- Component: Release automation decision guide / changesets vs semantic-release / app vs library versioning

## Content

### The mechanical difference, stated by Changesets' own maintainers

Per Changesets' own `docs/decisions.md`, three explicit differences from semantic-release: (1) Changesets is designed for **mono-repos first**, managing inter-package dependency bumps within the repo, which semantic-release and its mono-repo variant do not natively do; (2) Changesets commits change *information* to the filesystem (a markdown file per change, with YAML frontmatter naming affected packages and bump type) rather than deriving everything from git commit message parsing; (3) Changesets deliberately limits the bump-type vocabulary to bare `major`/`minor`/`patch` rather than semantic-release's broader Conventional-Commit-derived type vocabulary (`fix`, `feat`, `BREAKING CHANGE`, etc.) - description detail is pushed into the changeset's markdown body instead of encoded in a commit-message convention.

### Side-by-side mechanics (independent synthesis, brianschiller.com, structurally consistent with Changesets' own docs)

| | Changesets | semantic-release |
|---|---|---|
| Source of truth for "what changed" | Markdown files in `.changeset/` | Specially-formatted git commit messages (Conventional Commits) |
| Current version location | `package.json` `version` field | Git tags |
| Changelog | `CHANGELOG.md` file, generated from changeset files | GitHub/GitLab Releases page, generated from commit messages |
| When you can edit a change description | Anytime before release - it's just a file | Effectively never without rebasing every commit after it |
| Runtime access to "what version is this build" | Trivial - `package.json` has it | Documented as awkward - semantic-release's `package.json` `version` field is commonly left at a dummy `0.0.0`, since the real version is computed at publish time, after the app may already be built |

### Changesets explicitly supports non-npm and app (non-published) versioning

Per `changesets/docs/versioning-apps.md`: Changesets can version applications or non-npm-package artifacts (the doc names .NET NuGet packages, Ruby gems, Docker images as examples) - the only hard requirement is a `package.json` present purely to carry `name`/`private`/`version` fields for Changesets' own bookkeeping, even if nothing ever gets published to npm. This is enabled via `privatePackages: { version: true, tag: true }` in `.changeset/config.json` (default is `{ version: true, tag: false }` - changelog and version bump happen, but no git tag is created unless explicitly opted in). A versioned private/app package that depends on another package Changesets is configured to *skip* entirely is fine, since private packages never ship to npm with a stale reference to the skipped one.

### The actual decision: does a continuously-deployed app need versioning at all

Neither official source (Changesets' own docs) nor the independent comparison sources frame this as "always add one of these tools." The decision hinges on what the version number is *for*:

- **A published package (npm library, CLI users `npm install`)** - semver is a load-bearing external contract: consumers pin ranges against it, a wrong bump breaks downstream installs. Some versioning tool is close to mandatory here; Changesets vs semantic-release is a real choice, decided by monorepo-vs-single-package shape (per Changesets' own framing: "if you maintain many packages in one repo, Changesets usually fits better; for one package with no review step, semantic-release is simpler," per latchkey.dev's synthesis of the two projects' own stated design goals).
- **An app repo deployed continuously to a platform like Vercel** - there is no external consumer pinning a semver range against the app. The version number, if one exists at all, serves internal purposes only: correlating a deployed instance with a specific commit/build for support and rollback conversations, appearing in a `/health` or `/version` endpoint, or driving a human-readable changelog for internal stakeholders. None of these *require* semver-correctness the way a published package does - a monotonically increasing build number, a git SHA, or a date-stamped tag can serve the same purpose with far less process overhead than wiring up either Changesets or semantic-release.
- **When a continuously-deployed app repo DOES want a "release" concept anyway** - typically for a human-readable internal changelog (what shipped this week, for a support/success team, not an external API contract) or to gate a specific promotion event (see this skill's own environment-promotion guide) - Changesets' `versioning-apps.md` path (private, non-npm-published, `tag: false` by default) is the better-fit tool of the two for this case specifically, because it produces a reviewable release PR with a human-edited changelog *before* anything ships, rather than deriving the changelog automatically and irreversibly from commit message parsing the way semantic-release does. The review-gate property (a Changesets "Version Packages" PR a human can edit before merge) maps better onto "we want a curated changelog" than semantic-release's default fully-automated publish-on-push flow.

### Where semantic-release remains the better fit even outside the "published package" case

Per latchkey.dev's synthesis: fully automated, commit-driven releases with zero manual per-change authoring step, for a single deployable unit, no review gate wanted. If a team has strict Conventional Commit discipline already (enforced via commit-msg hook or a required PR-title check) and explicitly does not want a human-edited release PR step, semantic-release's fully-automatic model fits that preference; Changesets' explicit per-change authored file is by design an extra step contributors must remember (brianschiller.com notes this is enforced on CI in his own repos, "around the same time as tests are run," specifically because it's easy to forget as a git-commit-hook-only enforcement point given it happens later than the commit itself).

### Direct framing for this skill's decision guide

For **this repo's actual shape** (a SvelteKit app on Vercel, continuously deployed, not published to npm as a library): default recommendation is **no semver tool is required at all** for the deployed-app surface; if internal changelog/release-tracking is wanted, prefer Changesets in its `versioning-apps.md` mode (private, `tag` optional) over semantic-release, specifically for the human-review-gate property, and treat the resulting version as an internal artifact, not a contract external code depends on. Reserve semantic-release-or-Changesets-in-full-npm-mode for the separate, clearly-labeled case where this repo (or a package extracted from it) is genuinely published to npm and has real external consumers pinning ranges - the case this skill's legacy Hivemind/npm-package guides already cover in depth.
