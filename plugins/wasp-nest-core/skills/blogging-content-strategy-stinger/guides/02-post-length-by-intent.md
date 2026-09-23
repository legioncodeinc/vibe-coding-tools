# 02 - Post Length by Intent

Word count is a function of search intent, not a quality signal. This guide encodes the intent classification taxonomy and the word-count ranges that follow from each class. Never recommend a word count without first classifying intent.

> Research sources: `research/external/02-post-length-by-intent.md`, `research/external/2026-05-20-seo-content-clusters-topical-authority.md`

---

## The four intent classes

| Intent class | Reader goal | Examples |
|---|---|---|
| **Informational** | Learn something, understand a concept, get an answer | "what is topical authority", "how does sprint planning work", "benefits of daily standups" |
| **Commercial investigation** | Compare options, evaluate before deciding | "ahrefs vs semrush", "best project management tools for engineers", "notion vs linear for teams" |
| **Transactional** | Take an action or make a purchase | "linear pricing", "sign up for Ahrefs free trial", "download sprint retrospective template" |
| **Navigational** | Find a specific page or resource | "linear app login", "Notion sprint template", "HubSpot blog" |

---

## How to classify a post's intent

1. Enter the target keyword into Google and scan the top 5 SERP results.
2. Ask: are these results how-to guides (informational), comparison posts (commercial investigation), product/pricing pages (transactional), or homepage/login redirects (navigational)?
3. The SERP majority intent is the correct classification. If you try to rank a transactional page for an informational query, you will not rank — and vice versa.

**When intent is mixed:** Some keywords have split intent (e.g., "project management templates" attracts both informational and transactional results). In this case, match the dominant SERP intent (the majority of page 1 results) and acknowledge the secondary intent in the post's CTA.

---

## Word-count ranges by intent class

These are heuristic ranges, not hard targets. Use them to sanity-check scope, not to pad copy.

| Intent class | Word-count range | Notes |
|---|---|---|
| **Informational (pillar)** | 2,500–5,000 | Comprehensive coverage across all subtopics; links to cluster articles |
| **Informational (cluster article)** | 1,000–2,500 | Deep on one subtopic; links back to pillar + adjacent clusters |
| **Informational (support article)** | 600–900 | Answers one specific long-tail question |
| **Commercial investigation** | 1,500–3,500 | Needs depth for each option compared; comparison tables, pros/cons |
| **Transactional** | 300–800 | Clear offer, strong CTA, minimum friction; long copy buries the action |
| **Navigational** | N/A | Do not blog for navigational queries; these belong in product pages |

**Rule of thumb:** If you cannot fill the lower bound of the range with genuinely useful content (not filler), the post scope is too broad. Split it.

---

## The "diminishing returns" threshold

More words do not mean better ranking or better user experience past a certain point. The research shows:

- For informational posts competing for AI Overviews: clear structure and 40-60 word answer blocks matter more than raw length. (See `guides/05-aeo-formatting-patterns.md`.)
- For commercial-investigation posts: adding a 4th or 5th option to a comparison table almost never improves ranking; it adds maintenance burden without search benefit.
- For support articles: posts over 1,200 words on a long-tail question typically have scope creep. Ask: is this really one post or two?

**Stop-signal:** If writing feels like padding to reach a target — adding examples that do not illuminate, repeating earlier points with different phrasing — the post has hit its natural length. Stop writing.

---

## Intent and AEO

Informational posts are the primary AEO opportunity. Commercial-investigation posts can capture AI citations when they include factual claims with citations and well-structured comparison tables. Transactional posts rarely get cited by AI systems.

For informational posts: add the AEO structural layer from `guides/05-aeo-formatting-patterns.md` on top of the length guidance here.

---

## Example intent classifications

| Post title | Intent class | Word-count target |
|---|---|---|
| "What is topical authority and why does it matter in 2026" | Informational (cluster) | 1,200–1,800 |
| "Ahrefs vs Semrush for indie hackers: 2026 comparison" | Commercial investigation | 2,000–2,800 |
| "Start your Semrush free trial" | Transactional | N/A (product page, not a blog post) |
| "The complete guide to content marketing for B2B SaaS" | Informational (pillar) | 3,000–4,500 |
| "What is a pillar page?" | Informational (support) | 600–900 |
| "Sprint retrospective templates (free download)" | Transactional/informational hybrid | 800–1,200 |

See `examples/happy-path-new-saas-blog.md` for worked classification across a full cluster.
