---
name: blogging-content-strategy-stinger
description: Editorial blogging strategy specialist — cluster + pillar topical authority architecture, post length by search intent, title + H1 + meta description craft, keyword research scoping without obsession, AEO/answer-engine formatting (featured snippets, AI Overviews, chatbot citations), CTA copy that converts without begging, the canonical 12-point pre-publish review checklist, and realistic publishing-cadence planning for small teams. Use when the user says "map our blog content", "what should we write about", "review this post before publishing", "set a realistic blog cadence", "optimize this title or meta", "format this post for AI Overviews", "write a better CTA", or when `blogging-content-strategy-worker-bee` is invoked. Do NOT use for technical SEO implementation (schema markup, sitemap, robots.txt — route to `seo-aeo-worker-bee`), CMS setup (route to `website-worker-bee`), analytics dashboards, or social media distribution.
license: MIT
---

# blogging-content-strategy-stinger

The procedural arsenal for `blogging-content-strategy-worker-bee`. This Stinger encodes the editorial strategy layer of blogging: how to architect content for topical authority, how to decide what to write and how long to make it, how to craft titles and metas that earn the click, how to format posts so AI systems cite them, how to write CTAs that convert without desperation, and how to plan a publishing cadence that a one- to three-person team can actually sustain.

**The backbone is cluster-pillar architecture.** Read `guides/01-cluster-pillar-architecture.md` first, every time. Everything else — post length, title craft, AEO formatting, cadence planning — is downstream of the cluster map.

---

## When to load this Stinger

Load when any of these triggers are present:

- **Content architecture**: "help me map our blog", "what clusters should we own", "how many pillar pages do we need", "how do I build topical authority"
- **Post scoping**: "how long should this post be", "what's the right word count", "is this post too short / too long"
- **Title + meta craft**: "review my title", "write a meta description", "my CTR is low", "Google keeps rewriting my meta"
- **AEO formatting**: "format this for AI Overviews", "how do I get featured snippets", "make this citable by ChatGPT/Perplexity", "answer-engine optimization"
- **Keyword research**: "help me do keyword research", "which tool should I use", "is this keyword worth targeting", "we don't have budget for Ahrefs"
- **CTAs**: "write a better CTA", "my download button isn't converting", "stop my CTAs from sounding needy"
- **Pre-publish review**: "review this post before we publish", "run the quality checklist", "is this ready to go live"
- **Cadence planning**: "how often should we post", "set a realistic publishing schedule", "solo founder, how many posts a month"

Do NOT load for:

- Technical SEO implementation (schema markup, robots.txt, Core Web Vitals, hreflang) → `seo-aeo-worker-bee`
- CMS setup or hosting → `website-worker-bee`
- Social media amplification or paid distribution
- Individual post drafting (though this Stinger produces detailed post briefs that a human or AI writer follows)

---

## Procedure on each invocation

1. **Read `guides/01-cluster-pillar-architecture.md` first.** This is non-negotiable. The cluster map is the structural backbone; misaligned cluster work wastes effort.
2. **Identify the task type**: Is this a fresh blog setup (need cluster mapping)? An existing post review (checklist + optimization)? A single-post brief (post-length + title + AEO)? A cadence question? Route to the correct guide.
3. **Confirm business context** before making recommendations: product, audience, goal (traffic, signups, brand), team size, current domain authority (rough), and whether they have any keyword tool access.
4. **Execute the relevant guide(s).** Each guide is self-contained. Pull the right one for the task; do not run all guides on every invocation.
5. **Always run `guides/07-pre-publish-checklist.md`** when the task ends with a post going live. No post skips the gate.

---

## Guide map

| Guide | Use when |
|---|---|
| `guides/00-principles.md` | Reviewing the non-negotiables that govern all advice from this Stinger |
| `guides/01-cluster-pillar-architecture.md` | Building or auditing a content cluster map |
| `guides/02-post-length-by-intent.md` | Deciding target word count for a post |
| `guides/03-title-h1-meta.md` | Writing or reviewing titles, H1s, and meta descriptions |
| `guides/04-keyword-research-scoping.md` | Scoping keyword research and choosing tools |
| `guides/05-aeo-formatting-patterns.md` | Formatting posts for AI Overviews, featured snippets, chatbot citations |
| `guides/06-cta-rubric.md` | Writing or reviewing CTAs across all placement types |
| `guides/07-pre-publish-checklist.md` | Running the 12-point gate before any post goes live |
| `guides/08-cadence-planning.md` | Setting a sustainable publishing schedule |

---

## Templates

- `templates/cluster-map-template.md` — markdown table for mapping pillars + cluster posts + spokes
- `templates/post-brief-template.md` — the standard post brief template: intent, keyword, word-count target, title variants, H1, meta, AEO blocks, CTA placement

---

## Critical directives (summary — full in `guides/00-principles.md`)

- **Never recommend a cadence the team cannot sustain for six months.** Consistent publishing beats high-volume bursts for topical authority.
- **Separate keyword research from writing.** Research first, brief second, draft third.
- **Always classify intent before recommending length.** Word count is a function of intent, not a quality signal.
- **CTA copy must answer "why now" without implying the reader owes anything.** Beg-CTAs repel high-intent readers.
- **Run the 12-point review checklist before any post is marked publish-ready.** No exceptions.
- **Hand off technical SEO to `seo-aeo-worker-bee`.** This Stinger owns strategy and copy; schema, sitemap, and Core Web Vitals are out of scope.

---

## Handoff

When this Stinger's output will be consumed by another Angel:

- **Cluster map** → hand to `seo-aeo-worker-bee` for schema markup and technical implementation of the pillar page architecture.
- **Post briefs** → delivered to the human writer or AI writing tool.
- **Pre-publish checklist report** → kept in `library/knowledge-base/content/` if the repo has that path; otherwise delivered inline.

---

*Stinger forged by `stinger-forge` from `blogging-content-strategy-worker-bee-command-brief.md` and research gathered by `scripture-historian`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
