# AI Citations: How Answer Engines Select Sources / Why Structured Pages Get Cited More

- URL: https://machinerelations.ai/research/ai-citations-how-answer-engines-select-sources-2026 ; https://machinerelations.ai/research/structured-pages-cited-more-ai-engines-retrieval-research-2026
- Fetched: 2026-08-14
- Source type: vendor-blog
- Component: geo-aeo

## Notes

Research analyzing 21,143 citations across three major platforms identifies a two-stage pipeline: citation selection and citation absorption.

Selection: most AI answers cite only 3-8 sources (Perplexity ~16, ChatGPT ~7), a far narrower competitive surface than a 10-blue-link SERP. Selection depends on structural properties -- entity density, content structure, query-passage alignment -- more than traditional authority signals: backlinks r^2 = 0.038, traffic r^2 = 0.05 (near-zero predictive power).

Absorption: being cited is not the same as being used. ~32% of text from cited pages survives into final answers. ChatGPT cites fewer sources but extracts more content per source (4.2x more language per source than Perplexity); Perplexity and Google cite more sources but each contributes less.

Key stats:
- Pages with named entities (companies, people, products, standards, dates, amounts) earn citations at 267% higher rates than pages without.
- Pages with 15+ Knowledge Graph entities show 4.8x higher selection probability in Google AI Overviews.
- Tables increase citation likelihood 2.5x. FAQ structures show 28-40% higher citation probability. Structured data (Article/FAQPage/HowTo schema) correlates with 73% higher selection rates in Google AI Overviews.
- Query-passage cosine similarity is 7.3x more predictive of citation than domain authority -- the page must answer the specific question asked, not merely cover the general topic.
- Median cited sentence is 10 words or fewer -- engines extract precise factual statements, not paragraphs.
- ChatGPT's citations are 458 days fresher on average than organic search results for the same queries; 76.4% of top-cited pages were updated within 30 days. Perplexity shows the strongest freshness bias; foundational topics carry less freshness weight.
- Crawler accessibility is a binary gate applied before any quality evaluation -- paywalled, login-walled, or aggressively bot-blocked pages lose citation eligibility entirely regardless of content quality.

### Per-engine source preference (from a separate 7-month tracked study cited in this research)

| Engine | Dominant Source Type | Citation Behavior |
| --- | --- | --- |
| ChatGPT Search | Wikipedia, editorial sites | ~7 sources; extracts 4.2x more language per source than Perplexity |
| Perplexity | YouTube, news sources | ~16 sources per answer; strongest freshness bias |
| Google AI Overviews | YouTube, brand domains | YouTube dominates 5 of 7 intent categories; inherits Google Search ranking signals |
| Google AI Mode | Volatile; institutional sources | Most volatile engine tracked, shifted preferences multiple times in 7 months |
| Gemini | YouTube, structured sources | Consistent YouTube preference; schema and Google indexing most influential |
| Claude | Brand domains, institutional sources | Never surfaced YouTube, Wikipedia, or Reddit; distinct institutional preference |

ChatGPT shares only 10% URL overlap with Google's top-10 results for the same queries -- cross-engine measurement is necessary; optimizing for Google rank alone does not translate to AI citation share.

### "Structured pages get cited more" companion research

GEO-SFE framework (Yang et al., 2026) decomposed content structure into macro (document architecture), meso (information chunking), micro (visual emphasis) levels; structural optimization alone produced a 17.3% citation-rate improvement and 18.5% subjective-quality improvement while preserving semantic content.

"The SEO Floor" study (Lee, 2026): 100,411 AI citation events across ChatGPT, Perplexity, Claude, Google AI Mode / 2,000 queries. Schema markup was the strongest content-feature predictor of citation (odds ratio 1.31 univariate, 1.29 multivariate controlling for other features and SEO tier). Top-3 Google-ranked pages are ~34x more likely to be cited by AI engines than pages ranked 11-30 -- traditional search position is the gate; structure determines citation probability among pages that clear that gate.

GEO-16 framework (Kumar et al., 2025): 1,702 citations across Brave Summary, Google AI Overviews, Perplexity / 1,100 URLs, 16-pillar scoring. Metadata/freshness, semantic HTML, and structured data showed the strongest associations with citation. Pages scoring >=0.70 normalized with >=12 pillar hits aligned with substantially higher citation rates -- machine-legible structure is a threshold requirement, not a bonus.

Answer-first structure has an odds ratio of 1.09 for citation probability -- pages burying the core claim below introductory paragraphs lose extractability during passage selection.

Market concentration: the 5W AI Platform Citation Source Index 2026 found the top 15 domains capture 68% of all consolidated AI citation share across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews -- far more extreme concentration than traditional search ever produced. Those domains share machine legibility, syndication, and clean attribution as common properties.
