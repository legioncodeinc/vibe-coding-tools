# 05 - AEO Formatting Patterns

AEO (Answer Engine Optimization) is formatting posts so that AI systems — Google AI Overviews, featured snippets, ChatGPT, Perplexity, Copilot — can extract, cite, and surface your content.

In 2026, AEO is a 4-surface problem. Optimizing for featured snippets alone addresses only ~10% of the opportunity.

> Research sources: `research/external/2026-05-20-verityscore-aeo-guide-2026.md`, `research/external/2026-05-20-cxl-answer-engine-optimization-guide.md`, `research/external/2026-05-20-yarnit-featured-snippets-ai-overview-2026.md`

---

## The four AEO surfaces (2026)

| Surface | What it is | How to target |
|---|---|---|
| **Featured snippets / PAA** | Position-zero SERP result; Google extracts a direct answer | 40-60 word answer blocks + question-framed H2s |
| **Voice assistants** | Siri, Google Assistant, Alexa reading aloud | Conversational sentence structure; 15-20 words/sentence |
| **Google AI Overviews** | Multi-source synthesis shown above organic results | Citations + statistics; content in first 30% of page |
| **Third-party AI chatbots** | ChatGPT, Perplexity, Copilot citing sources | External citations; statistics with source attribution; non-blocked crawlers |

**Key stat (BrightEdge 2026):** 55% of AI Overview citations come from the first 30% of a page. Front-load your most citable content.

**Key stats (Princeton KDD 2024 paper):**
- Adding statistics to a post increases AI visibility by +41%.
- Adding external citations increases AI visibility by +28% on average, and by +115% for poorly-ranked pages.

---

## The six AEO structural patterns

### Pattern 1: Definition block

**When to use:** Any post where the reader needs to understand a concept before using it. Use at the first mention of the primary concept.

**Structure:**
```
## What is [concept]?

[40-60 word definition that answers the question completely as a standalone sentence or two. 
Write it so it can be read without surrounding context. Avoid "it is a..." — lead with the 
subject: "[Concept] is [specific definition]."]
```

**Example:**
> **What is topical authority?**
> Topical authority is a domain's credibility signal to search engines and AI systems on a specific subject area, built by publishing a comprehensive cluster of interlinked posts that cover the subject from multiple angles. Domains with high topical authority rank for new posts in their cluster faster than domains without it.

---

### Pattern 2: Numbered steps

**When to use:** Any how-to or process post. The numbered structure is the most reliably extracted format for both featured snippets and AI Overviews.

**Structure:**
```
## How to [do the thing]

1. **Step name.** [One sentence description. Under 20 words.]
2. **Step name.** [One sentence description. Under 20 words.]
...
```

**Rules:**
- Each step is numbered and starts with a bold step name.
- Each step description is one sentence (15-20 words max) for voice extractability.
- Steps must be sequential and exhaustive for the intended reader.

---

### Pattern 3: Comparison table

**When to use:** Any commercial-investigation post comparing two or more options. Tables are reliably cited by AI systems for structured comparison queries.

**Structure:**
```markdown
| Factor | Option A | Option B |
|---|---|---|
| [Factor 1] | [Value] | [Value] |
| [Factor 2] | [Value] | [Value] |
```

**Rules:**
- Include the source year or data freshness in a caption below the table: *(Pricing as of May 2026. Check vendor sites for current rates.)*
- Table rows should be facts, not opinions ("$117/mo annual" not "pretty affordable").
- One "best for" row summarizing the use case for each option.

---

### Pattern 4: FAQ schema candidates

**When to use:** Any page where Google shows "People Also Ask" results for the primary keyword. These PAA questions should be answered as FAQ schema candidates.

**Structure:**
```
## Frequently asked questions

### [PAA question exactly as phrased in Google]
[40-60 word answer block. Complete, standalone answer.]

### [PAA question 2]
[40-60 word answer block.]
```

**Technical implementation note:** The actual FAQPage schema markup (`application/ld+json`) is handled by `seo-aeo-worker-bee`, not by this Stinger. Your job is to write the question-answer pairs in this structure so they are ready for schema application.

---

### Pattern 5: Pros/cons list

**When to use:** Commercial-investigation posts; any post where the reader is evaluating a decision. AI systems extract pros/cons lists reliably for "is X worth it" queries.

**Structure:**
```
### Pros of [option]
- [Specific pro. One sentence.]
- [Specific pro.]

### Cons of [option]
- [Specific con. One sentence.]
- [Specific con.]
```

**Rule:** Each item must be specific and factual, not vague ("it's fast" → "indexed at 99th percentile CDN latency").

---

### Pattern 6: Stat callout

**When to use:** Any time you cite a statistic that supports a key claim. Stat callouts function as credibility anchors for AI systems.

**Structure:**
```
> **Key stat:** "[Quote or paraphrase of the stat]" — [Source name, year]
```

**Rule:** Cite the primary source, not a roundup article. "BrightEdge 2026" is citable. "According to various studies" is not.

---

## The 40-60 word answer block rule

Every H2 section in an informational post should begin with a 40-60 word standalone answer block before expanding into detail. This is the single most impactful AEO structural change.

**Why:** BrightEdge 2026 data shows 55% of AI Overview citations come from the first 30% of a page. Most H2 sections have their key claim buried 300 words in. Moving the answer to the first two sentences of each section dramatically increases citation probability.

**How to check:** Read the first two sentences of each H2 section. If they do not contain a complete answer to the implied question in the H2 heading, rewrite them.

---

## What NOT to do for AEO

- **Do not block AI crawlers.** If your `robots.txt` blocks `OAI-SearchBot`, `PerplexityBot`, `Claude-User`, or `ChatGPT-User`, you are blocking citation entirely. Technical implementation is handled by `seo-aeo-worker-bee`, but flag this as a handoff item.
- **Do not cite data-roundup articles.** Cite the original research paper, vendor report, or primary source. AI systems prefer original citations.
- **Do not use vague anchor phrases.** "Studies show" and "research indicates" do not produce attributable citations. Name the source.

---

## AEO checklist for any informational post

- [ ] H2s are framed as questions when the section answers a question.
- [ ] First 2 sentences of each H2 section = 40-60 word standalone answer.
- [ ] All statistics cite the primary source by name and year.
- [ ] How-to sections use numbered steps with bold step names.
- [ ] Comparison content uses a markdown table.
- [ ] Frequently-asked-questions section present if PAA shows for the primary keyword.
- [ ] No AI crawlers blocked in robots.txt (flag to `seo-aeo-worker-bee` for verification).

See `guides/07-pre-publish-checklist.md` for the full pre-publish gate, which includes AEO checks.
