# Versioning — Knowledge Base Help Center

## When versioning matters

KB versioning is necessary when:
- The product ships breaking changes that invalidate existing how-to articles.
- Multiple major versions are in active use simultaneously (e.g., v2.x and v3.x customers coexist).
- The team publishes beta/preview documentation before a feature ships.

KB versioning is NOT necessary when:
- The product has a single release track with no backwards-incompatible changes.
- Articles are updated in-place without needing a historical record for users on older versions.

---

## Versioning support by platform

| Platform | Version support | Parallel versions | Notes |
|---|---|---|---|
| Help Scout Docs | Article revision history only | No | No branching; update articles in place |
| Intercom Articles | No versioning | No | Content is always current; no version concept |
| Document360 | **Full branch versioning** | **Yes (multiple active branches)** | Enterprise feature; Business+ tier required |
| ReadMe.com | Git-backed version control | Yes | Each version is a branch; integrates with GitHub |
| Zendesk Guide | Basic; no branching | No | Manual copy/archive approach required |

---

## Document360 branch versioning (recommended for parallel versions)

Source: `research/external/2026-05-20-document360-2026-features.md`

Document360 supports creating separate "versions" of the KB that map to product release cycles. Key behaviors:
- Articles can be marked as "available in version X.x and above."
- Users land on the version matching their product subscription (configurable via JWT portal auth).
- Branch versioning allows maintaining v2.x documentation while authoring v3.x content in parallel.

**Setup pattern:**
1. Create a "Main" branch for the current release (v3.x).
2. Create a "v2-maintenance" branch for legacy users; mark it read-only for the content team.
3. Use the Eddy AI "diff compare" feature to identify articles that diverge between branches.
4. Set an end-of-life date for the maintenance branch; communicate it in a banner article.

---

## ReadMe.com version control (Git-backed)

Source: `research/external/2026-05-20-readme-com-2026-features.md`

ReadMe integrates with GitHub for docs-as-code version management:
- Each product version maps to a git branch.
- The `@readme/cli` CLI syncs markdown changes from the repo to the ReadMe portal.
- The GitHub AI Writer can generate initial docs from OpenAPI spec changes and propose a PR.

**When to use:** The team already manages docs in a git repo and wants a developer-facing portal with changelogs. Not suitable for non-developer authoring teams.

---

## Version changelog for articles

Regardless of platform, maintain a "What's new in this version" article at the top of each version's Getting Started section. Update it with every product release that changes documented behavior.

**Template:** See `templates/kb-setup-checklist.md` for the article changelog entry format.

---

## Deprecation handling

When a product version reaches end-of-life:
1. Add a prominent callout banner at the top of all articles in the deprecated version: "This version is no longer supported. [Link to upgrade guide]."
2. On Zendesk Guide / Help Scout Docs (no native versioning): move deprecated articles to an "Archived" category rather than deleting them — Google indexes these and users on old versions still arrive.
3. Redirect the deprecated version's canonical URL to the current version after 6 months.

---

*Sources: `research/external/2026-05-20-document360-2026-features.md`, `research/external/2026-05-20-readme-com-2026-features.md`.*
