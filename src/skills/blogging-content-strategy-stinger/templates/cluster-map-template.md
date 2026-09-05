# Cluster Map Template

Use this template to document and maintain the content cluster architecture. One file per domain/blog. Update whenever a new post is added, a post is merged, or a cluster is deprecated.

---

## Metadata

| Field | Value |
|---|---|
| Domain | [domain.com] |
| Last updated | [YYYY-MM-DD] |
| Active clusters | [N] |
| Total published posts | [N] |
| Owner | [name] |

---

## Cluster [A]: [Cluster Topic Name]

**Pillar page**

| Field | Value |
|---|---|
| Title | [Full title of pillar page] |
| URL | [/slug] |
| Status | Draft / Scheduled / Published [YYYY-MM-DD] |
| Word count | [target: 2,500-5,000] |
| Primary keyword | [keyword] |
| KD (difficulty) | [0-100] |

**Cluster articles**

| # | Title | URL | Status | Intent | Word count | Published |
|---|---|---|---|---|---|---|
| 1 | [Title] | [/slug] | Draft/Published | Informational | [target] | [YYYY-MM-DD or blank] |
| 2 | [Title] | [/slug] | Draft/Published | Informational | [target] | [YYYY-MM-DD or blank] |
| 3 | [Title] | [/slug] | Draft/Published | Commercial investigation | [target] | [YYYY-MM-DD or blank] |
| 4 | [Title] | [/slug] | Planned | Informational | [target] | — |
| 5 | [Title] | [/slug] | Planned | Informational | [target] | — |

**Support articles**

| # | Title | URL | Status | Parent cluster article | Published |
|---|---|---|---|---|---|
| 1 | [Title] | [/slug] | Draft/Published | [Cluster article #] | [YYYY-MM-DD or blank] |
| 2 | [Title] | [/slug] | Planned | [Cluster article #] | — |

**Internal link status**

| Check | Status |
|---|---|
| Pillar → all cluster articles | ✅ / ❌ / Partial |
| All cluster articles → pillar | ✅ / ❌ / Partial |
| Cluster articles ↔ adjacent clusters (2-4 cross-links each) | ✅ / ❌ / Partial |
| Support articles → parent cluster article | ✅ / ❌ / Partial |

**Cluster health**

| Metric | Value | Target | Status |
|---|---|---|---|
| Pillar published | [Yes/No] | Yes | ✅ / ❌ |
| Cluster articles published | [N] | 8-12 | ✅ / In progress |
| Topical authority signal (GSC impressions growth) | [%] | Positive | ✅ / ❌ |

---

## Cluster [B]: [Cluster Topic Name]

*[Repeat the block above for each cluster]*

---

## Deprecated / Abandoned posts

Posts that are not part of any cluster and are not being actively developed.

| Title | URL | Decision | Action |
|---|---|---|---|
| [Title] | [/slug] | Abandon | Leave live, no investment |
| [Title] | [/slug] | Redirect | 301 → [target URL] |
| [Title] | [/slug] | Delete | Remove + 404 monitor |

---

## Cluster roadmap

Future clusters planned but not yet started.

| Priority | Cluster topic | Pillar hypothesis | Start quarter | Notes |
|---|---|---|---|---|
| High | [Topic] | "[Pillar title hypothesis]" | Q[N] [YYYY] | [Rationale] |
| Medium | [Topic] | "[Pillar title hypothesis]" | Q[N] [YYYY] | [Rationale] |
