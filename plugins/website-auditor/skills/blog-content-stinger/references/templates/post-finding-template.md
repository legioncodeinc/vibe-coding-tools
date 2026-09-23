# Per-post finding template

Copy this block once per analyzed post (up to 10, per PRD-018 AC-2). Do not remove any field, if a field genuinely does not apply, write "N/A" and say why in one clause, do not delete the row.

```markdown
### {N}. {Post title}

- **URL:** {url}
- **Published date:** {YYYY-MM-DD} (source: {json-ld:datePublished | meta:article:published_time | time:datetime | frontmatter:date})
- **Word count:** {integer} (source: `select-recent-posts.py`, deterministic)

**[subjective] Semantic/quality read**

{2-4 sentences. Cover: clarity and structure, depth versus surface-level treatment, whether the post delivers on its own headline/promise, and audience fit. Label this whole subsection `[subjective]` in the heading above, do not blend it into the quantified fields, and do not phrase it as if it were a measured fact.}

**AI-authorship-probability analysis**

- **Probability band:** {low | low-moderate | moderate | moderate-high | high} ({X}-{Y}%)
- **Method:** {named detector or heuristic actually used this run, e.g. "Originality (commercial detector, thresholding-range classification)" or "manual stylistic-marker read, no automated detector run this pass"}
- **Error rate:** {stated accuracy/error figure for that method, with its source and the domain it was measured in, e.g. "Springer 192-text EFL-writing study: 0.69 overall accuracy / ~31% misclassification for Originality [raw/link-springer-com-article-10-1007-s40979-026-00213-1.md]; this study is academic-writing, not blog/marketing content, treat the transfer as unverified"}
- **Basis for this band:** {1-2 sentences naming the specific signals that moved the estimate, e.g. "unusually uniform sentence length and an absence of first-person anecdote across 1,200 words" - never just "it reads AI-generated"}

Do not write anything resembling "this post was/was not AI-written." If you catch yourself writing that sentence, stop and rephrase per `guides/03-ai-authorship-probability-band-reporting.md`.
```

## Field-by-field notes

- **Word count** always comes from the script, never estimated by eye. If the script could not pair an `.md` file, report `0` and flag it as a gap, do not guess a plausible-looking number.
- **[subjective] Semantic/quality read** is a judgment call and must say so in its own heading. Keep it separate from the quantified word count and from the AI-authorship band, these are three different kinds of claim and mixing them defeats the purpose of labelling any of them.
- **AI-authorship probability band** is never a single number pretending to be precise (never "73% AI-written"), it is a band with the method and error rate stated alongside it in the same sentence or table row, every time, with no exceptions. See the dedicated guide before writing this section for the first time in a run.
