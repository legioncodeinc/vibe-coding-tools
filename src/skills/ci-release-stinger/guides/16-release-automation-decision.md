# 16 - Release automation decision guide: changesets, semantic-release, or nothing

Primary case for this repo's app surface. For the case where the artifact IS a published npm package (this skill's legacy Hivemind scope), see `guides/05-release-flow.md` and `guides/06-npm-release.md` instead - this guide's "no versioning needed" default does NOT apply there.

## The mechanical comparison

| | Changesets | semantic-release |
|---|---|---|
| Source of truth | Markdown files in `.changeset/` | Conventional Commit messages |
| Monorepo support | First-class (per-package) | Possible, more setup |
| Release flow | Reviewable release PR | Fully automatic on push |
| Contributor effort | Add a changeset file per change | Write conforming commit messages |
| Runtime version access | Trivial (`package.json`) | Documented as awkward - `version` field is commonly left at a dummy value since the real version is computed at publish time |

Source: `research/distilled-ci-release.md` §8.

Changesets officially supports versioning **non-npm-published applications** (its own `docs/versioning-apps.md` names NuGet packages, Ruby gems, Docker images as examples), via `privatePackages: { version: true, tag: true }` in `.changeset/config.json` - the only hard requirement is a `package.json` present purely for `name`/`private`/`version` bookkeeping, even if nothing ever ships to npm.

## The actual decision for this repo: does the app surface need versioning at all

**Default recommendation: no semver tool required at all** for a continuously-deployed Vercel app with no external consumers pinning a version range against it. This is a judgment call synthesized from official Changesets docs and independent comparison sources, not a single source's verdict - state it as reasoned judgment when giving this recommendation, not as an uncontested fact. A published npm library has an external semver contract; a Vercel-deployed app does not. A build number, git SHA, or date-stamped tag serves internal correlation/rollback/support conversations without the process overhead either tool adds. Source: `research/distilled-ci-release.md` §8.

**If an internal, human-curated changelog is wanted anyway** (e.g. for a support/success team, not an external API contract), prefer **Changesets in its app-versioning mode** over semantic-release, specifically because of its reviewable-release-PR property: a human can edit the changelog before it ships, rather than semantic-release's default fully-automatic derive-and-publish-on-push flow. This is a fit-for-purpose choice, not a claim that Changesets is universally superior - semantic-release remains the better fit for a team wanting zero-manual-step automation from strict Conventional Commit discipline with no review gate. Source: `research/distilled-ci-release.md` §8.

**Reserve full npm-publishing-mode Changesets or semantic-release** for the case a package genuinely gets extracted from this repo and published to npm with real external consumers - that is exactly the case `guides/05-release-flow.md` and `guides/06-npm-release.md` already cover in depth (the legacy Hivemind scope).

## Decision checklist

1. Does anything outside this repo's own deploy pipeline pin a version range against this code? If no, skip a semver tool entirely.
2. Is an internal changelog wanted for support/stakeholder visibility? If yes, use Changesets in app-versioning mode (`privatePackages`, `tag` optional), not semantic-release, for the review-gate property.
3. Is a package about to be extracted and published to npm? If yes, this becomes the legacy npm-package case - route to `guides/05-release-flow.md` and `guides/06-npm-release.md`, not this guide.

## Cross-references

- `changelog-release-notes-stinger` - if it exists in scope for this repo's app surface (currently scoped to the Hivemind npm package in this Hive), the mechanics/copy split described there (this skill owns cut mechanics, that skill owns announcement prose) still applies if this repo adopts an internal changelog process.
- `guides/05-release-flow.md`, `guides/06-npm-release.md` - the npm-package case this guide explicitly does not replace.
