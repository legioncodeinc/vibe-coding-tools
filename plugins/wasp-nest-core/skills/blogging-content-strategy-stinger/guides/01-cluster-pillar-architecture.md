# 01 - Cluster + Pillar Architecture

The structural backbone of the entire content strategy. Every other guide — post length, title craft, AEO formatting, cadence planning — operates within the architecture defined here. Read this guide first, every time.

> Research sources: `research/external/2026-05-20-seo-content-clusters-topical-authority.md`, `research/external/2026-05-20-topic-clusters-pillar-pages-complete-guide.md`, `research/external/2026-05-20-searchengineland-topic-clusters-guide.md`

---

## What topical authority means in 2026

Topical authority is the property a domain has when Google and AI systems treat it as a comprehensive, credible reference for a subject area. In 2026, after Google's June 2025 core update (which penalized thin standalone posts while rewarding depth-and-breadth content hubs), topical authority is the dominant SEO architecture.

**Key data points:**
- Clustered content drives ~30% more organic traffic and 2.5x longer ranking persistence than standalone posts (HireGrowth 2025 analysis).
- For AI citation: clustered content receives 3.2x more AI citations than standalone posts.
- June 2025 Google update explicitly reinforced topical depth over domain authority as a quality signal.

This means: isolated, one-off posts on random topics actively harm domain performance in 2026. Every post must belong to a cluster.

---

## The cluster-pillar model

```
PILLAR PAGE (hub)
├── Cluster article 1 (subtopic A)
├── Cluster article 2 (subtopic B)
├── Cluster article 3 (subtopic C)
...
├── Cluster article N (subtopic N)
└── Support articles (long-tail questions within cluster)
```

**Pillar page:** A comprehensive reference on the main topic. Covers all major subtopics at a survey level and links out to each cluster article. Think of it as the authoritative "guide to X" that earns the main cluster keyword.

**Cluster articles:** Deep-dives on individual subtopics of the pillar. Each covers its subtopic exhaustively and links back to the pillar and to adjacent cluster articles.

**Support articles:** Short, hyper-specific posts answering long-tail questions that fall within the cluster. They link to the nearest cluster article (not the pillar directly, unless the question is directly addressed there).

---

## Word count specifications by post type

From the research consensus across three sources:

| Post type | Word count range | Notes |
|---|---|---|
| Pillar page | 2,500-5,000 words | Under 2,000 = insufficient for topical coverage; over 8,000 = scope creep risk |
| Cluster article | 1,000-2,500 words | 1,500 is the modal recommendation; match to intent (see `guides/02-post-length-by-intent.md`) |
| Support article | 600-900 words | Long-tail questions; keep focused |

---

## How to map a cluster from a seed topic

**Step 1: State the seed topic as a domain, not a keyword.**
- BAD: "project management software"
- GOOD: "project management for engineering teams"

The domain statement becomes the pillar page's subject.

**Step 2: Generate 10-15 subtopic questions a reader of the pillar would have.**
Use: Google autocomplete, People Also Ask (PAA), your own product FAQ, and customer conversations. Each question is a candidate cluster article.

**Step 3: Group questions by subtopic.**
Related questions (e.g., "how to set up sprints" and "sprint planning templates") belong in the same cluster article, not separate posts. Collapse aggressively — over-fragmenting is the most common cluster mistake.

**Step 4: Identify long-tail support article candidates.**
For questions that are very specific ("how to run a sprint retrospective in Notion") and too narrow for a cluster article, queue them as support articles once the cluster article they support is published.

**Step 5: Validate the cluster hypothesis with keyword data.**
Before committing to a cluster, confirm that the pillar topic has search demand (any volume is acceptable for new domains; the threshold rises with domain authority). See `guides/04-keyword-research-scoping.md`.

---

## How many pillars?

The research is clear on this. Too many pillars = authority scattered across topics = none of them rank.

| Team situation | Recommended pillars |
|---|---|
| Solo founder, new domain | 1-2 pillars maximum |
| Small team (2-5), 0-18 months old | 2-3 pillars |
| Established domain with 50+ posts | Audit existing posts first, map them to clusters retroactively, then add new pillars |

**Work each pillar to depth (12+ cluster articles) before starting new pillars.** A pillar with 3 cluster articles does not generate topical authority; a pillar with 12 does.

---

## Internal linking rules

Internal linking is the mechanical expression of the cluster-pillar architecture.

1. **Every cluster article links back to the pillar.** The anchor text should be a natural phrase that includes the pillar's primary keyword.
2. **Every cluster article links to 2-4 adjacent cluster articles** within the same cluster.
3. **Support articles link to their parent cluster article** (not the pillar directly, unless the pillar directly addresses the question).
4. **The pillar page links out to every cluster article** under it.
5. **Do not cross-link between unrelated clusters** unless there is genuine topical overlap.

---

## Pillar-first rule

**Publish the pillar page before any cluster content.**

This is a non-negotiable rule supported by the research (see `research/external/2026-05-20-seo-content-clusters-topical-authority.md`): publishing the pillar first establishes the hub architecture, gets it indexed, and gives cluster articles a parent to link to on the day they publish. Cluster articles published before their pillar are orphaned until the pillar catches up — this delays both ranking and authority signals.

If the pillar cannot be written first (e.g., it requires research that is still in progress), publish a placeholder pillar (1,500 words minimum, clearly marked as "growing") with the plan to update it to full length within 60 days.

---

## Growth timeline expectations

These are realistic horizons based on the research:

| Phase | Timeline | What to expect |
|---|---|---|
| Indexing + initial signal | 0-3 months | Google crawls, DA base established, little visible traffic |
| First cluster consolidation | 3-6 months | Cluster articles begin ranking for long-tail terms; pillar gets first impressions |
| Domain-level topical effect | 9-12 months | "Topical authority halo" appears: new posts in established clusters rank faster |

**Solo founder expectation:** First visible organic consolidation at 3-6 months. Do not evaluate the strategy's success before the 6-month mark.

---

## Retroactive cluster mapping (for existing blogs)

If the blog already has posts:

1. List all existing posts in a spreadsheet.
2. Identify natural clusters by grouping posts by topic similarity.
3. For each cluster: is there a pillar page? If not, create one (or promote the most comprehensive existing post).
4. Fix internal links to match the cluster-pillar model.
5. Identify orphaned posts (no natural cluster) and either: (a) delete/redirect them if thin, or (b) create a new cluster around them if they have traffic.

See `examples/happy-path-new-saas-blog.md` for a new blog setup and `examples/existing-blog-audit.md` for a retroactive mapping example.

---

## Template

Use `templates/cluster-map-template.md` to document and maintain the cluster map.
