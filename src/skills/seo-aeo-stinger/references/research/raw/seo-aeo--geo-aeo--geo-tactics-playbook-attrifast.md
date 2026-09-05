# GEO Tactics Playbook: 12 Ways to Get Cited

- URL: https://attrifast.com/blog/geo-tactics-playbook-2026
- Fetched: 2026-08-14
- Source type: vendor-blog
- Component: geo-aeo

## Notes

Grounding source: Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande, "GEO: Generative Engine Optimization" (arXiv:2311.09735 / KDD 2024, Princeton). Tested content strategies across ten engines / 10,000 queries; combined techniques lifted a source's visibility in generated answers by up to ~40%.

| # | Tactic | Setup time | Citation lift | Measurement |
| --- | --- | --- | --- | --- |
| 1 | Structured first-token answers | 30 min/page | High | Direct-answer appears in citation |
| 2 | llms.txt | 30 min total | Medium | Bot crawl rate |
| 3 | Schema (FAQPage, HowTo, ItemList) | 1 hr + 5 min/page | High | Rich Results Test pass |
| 4 | Comparison tables | 15 min/page | High | Citation snippet contains table |
| 5 | Quoted expert sources | 10 min/page | Medium | Attributed quote in answer |
| 6 | Original data / benchmarks | 4-40 hrs/study | High | Inbound links + direct citations |
| 7 | Specific numbers over vague claims | 5 min/page | Medium | AI answer cites the number |
| 8 | Multi-format content (table+paragraph+bullets) | 20 min/page | Medium | Engine-specific coverage |
| 9 | Source URL hygiene | 1-2 hr audit | Low-Medium | URL appears verbatim |
| 10 | Reddit/Quora/forum seeding | 1-3 hr/answer | Low-Medium | Linked from cited thread |
| 11 | Brand entity disambiguation | 2-3 hrs | High | Knowledge Graph card |
| 12 | Measure AI citations and revenue | 30 min-2 wks | enables all others | Attributed revenue |

Per-engine tactic weighting (H=high, M=medium, L=low):

| Tactic | ChatGPT | Perplexity | Claude | Gemini | AI Overviews |
| --- | --- | --- | --- | --- | --- |
| First-token answers | H | H | H | M | H |
| llms.txt | M | M | M | L (not yet read) | L |
| Schema (FAQ, HowTo) | H | H | M | M | H |
| Comparison tables | M | H | H | M | M |
| Quoted expert sources | M | H | H | M | M |
| Original data | H | H | H | H | H |
| Specific numbers | H | H | M | M | H |
| Multi-format content | M | M | H | M | M |
| URL hygiene | L | M | L | M | M |
| Reddit/Quora seeding | M (indirect) | L | L | L | L |
| Brand entity (sameAs, Wikidata) | H | H | H | H | H |

Entity disambiguation is the only tactic rated High across all five engines -- cheapest, most-skipped move. Schema underperforms on Claude, which favors prose/tables over JSON-LD extraction. llms.txt is wasted on Gemini (does not yet read the file, as of mid-2026) but pays off on ChatGPT, Perplexity, Claude. llms.txt adoption sits near 7% of public SaaS sites in Q1 2026 -- still differentiating precisely because so few competitors have a populated file.

Recommended llms.txt implementation: hand-written file at `/llms.txt`, H1 site name, single-paragraph description, markdown sections listing most LLM-relevant pages with one-line descriptions. Add named AI-crawler `Allow` rules to robots.txt, a `Sitemap:` line, and `X-Robots-Tag: index, follow` headers on canonical pages.

Measurement: grep access logs weekly for AI bot user agents (GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended) hitting `/llms.txt` and then traversing listed URLs, confirming the file is actually read.

GEO/SEO overlap ~70-80% on mechanics (both reward indexable HTML, schema, internal links, topical authority); the 20-30% delta is schema density, citation-friendly first-token answers, llms.txt, entity disambiguation, and source-URL hygiene.
