# 01. Post selection and word count

How to identify the 10 most recent blog posts and compute their word counts, before any quality or AI-authorship analysis starts. This is the procedural spine for the quantified half of this Drone's job.

## Phase 0 - confirm a blog exists at all

Per PRD-018 AC-1, this Drone's checkpoints resolve to 0/N/A, excluded from the score, whenever no blog/content-marketing section is detected. Do not run the rest of this procedure speculatively. Check for a blog-shaped path segment (`/blog/`, `/news/`, `/articles/`, `/insights/`, `/resources/`, `/guides/`) across the crawled `site-data/` corpus, or a blog-shaped entry already recorded by `stack-fingerprint-wasp-drone`/`site-crawler-wasp-drone` in `_shared/target-profile.json` if that field exists. If nothing matches, write the `11-blog/` summary's "no blog detected" branch (per `references/templates/11-blog-summary-template.md`) and stop, this is not a forced checkpoint and a silent skip is the correct outcome, not a penalty.

## Phase 1 - run the selection script

Run `references/scripts/select-recent-posts.py` against the run's `site-data/` directory:

```
python3 references/scripts/select-recent-posts.py --site-data <run-workspace>/site-data --count 10 --out <run-workspace>/11-blog/post-selection.json
```

The script finds blog-path candidates, extracts a publish date from JSON-LD `datePublished`, `article:published_time` meta, `<time datetime>`, or markdown frontmatter `date:` (in that priority order, first match wins per page), sorts descending, and keeps the top 10. It also computes each kept post's word count from its paired `.md` file.

## Phase 2 - handle the edge cases the script surfaces honestly

- **Fewer than 10 dated candidates found.** The script's `warnings` array says so. Report the actual count analyzed in `11-blog/`'s summary, do not silently claim 10 or manufacture additional posts.
- **A candidate has no publish date signal.** It is excluded from the ranking, not defaulted to "most recent." This is intentional, a wrong recency guess is worse than an honest exclusion. Note the excluded slug in the run's verification log.
- **A candidate has no paired `.md` file.** Word count reports as 0 with a flag, this is a `site-crawler-wasp-drone` coverage gap, not something to paper over by estimating from the HTML.
- **Path-pattern heuristic misses or over-matches.** The default pattern (`/(blog|news|articles|insights|resources|guides)/`) is a heuristic, not ground truth. If the crawled site clearly has a blog under a non-matching path (e.g. `/thoughts/`, `/writing/`), pass a custom `--path-pattern` rather than accepting a false "no blog detected."

## Phase 3 - word count is final once computed

Word count is the one fully deterministic output in this Drone's pipeline. Report it exactly as the script returns it in each post's finding (`references/templates/post-finding-template.md`). Do not round it, do not re-estimate it by eye, and do not adjust it based on a subjective read of "this feels shorter than it counts."

## What comes next

Once the 10 (or fewer, honestly reported) posts and their word counts are established, move to [02-subjective-quality-analysis.md](02-subjective-quality-analysis.md) for the `[subjective]` read, then [03-ai-authorship-probability-band-reporting.md](03-ai-authorship-probability-band-reporting.md) for the AI-authorship analysis, which is this Stinger's binding, non-negotiable conduct rule. Both run per post before the run-level roll-up in [04-report-and-workspace-output.md](04-report-and-workspace-output.md).
