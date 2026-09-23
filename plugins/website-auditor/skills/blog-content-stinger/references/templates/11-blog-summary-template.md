# `11-blog/` run output template

This is the roll-up file this Drone writes to the run workspace's `11-blog/` folder (per the build plan's shared-workspace spec and PRD-018's shared-workspace contract: reads `site-data/`, writes `11-blog/`). One copy of this file per run, one `### {N}. {Post title}` block per post using `post-finding-template.md`.

```markdown
# Blog content audit

**Blog detected:** {yes | no}

If **no**: stop here. Per PRD-018 AC-1, this checkpoint resolves to 0/N/A and is excluded from the score entirely, it is not a missed-opportunity penalty. State plainly what signal led to "no blog detected" (e.g. "no `/blog/`, `/news/`, `/articles/`, `/insights/`, or `/resources/` path segment found across the crawled `site-data/` corpus") and stop. Do not analyze zero posts and call it a pass.

If **yes**, continue:

- **Posts analyzed:** {count} of the 10 most recent (per PRD-018 AC-2; if fewer than 10 dated posts exist, state the actual count and why, do not pad)
- **Selection method:** `select-recent-posts.py`, recency by {json-ld:datePublished | meta:article:published_time | time:datetime | frontmatter:date}, see `guides/01-post-selection-and-word-count.md`
- **AI-authorship detection method(s) used this run:** {name every method actually applied across the post set, even if it varies post to post}

## Per-post findings

{One block per post, using `post-finding-template.md`, numbered 1 through however many were analyzed.}

## Cross-post observations [subjective]

{Optional, 2-4 sentences max. Patterns across the set only, e.g. "posts published after {date} show materially shorter word counts than earlier posts" or "AI-authorship probability bands cluster higher for the three most recent posts than for older ones." Still labelled `[subjective]` if it involves any judgment beyond a plain count; a pure count-based observation (e.g. average word count) does not need the label.}

## Verification log

{Any candidate finding that was rejected or reframed during this pass, with the reason. Per this pair's conduct rules (PRD-018), rejected/reframed candidates are logged here, not silently dropped, even in a bonus/conditional Drone like this one.}

- {finding candidate} - {rejected/reframed} - {reason}

## Evidence index

{Every artifact this pass produced or relied on: script output path, each post's `html_path`/`md_path` from `site-data/`, and the distilled-research file(s) any AI-authorship claim traced to.}
```
