# Domain research for support-response-stinger

This archive supports white-label provider emails for tickets involving a HighLevel-powered service. It separates two evidence jobs that should not be blended:

- Trend evidence identifies what people actually reported or searched for during the fixed window from 2026-06-04 through 2026-09-04.
- Evergreen official documentation supplies current troubleshooting facts even when the article itself predates the trend window.

Official documentation never proves issue frequency by itself. Community mentions never prove a root cause by themselves. The catalog uses trend evidence to rank demand and official documentation to ground the answer.

## Archive layout

- `topic.md`: the locked domain, boundaries, and completion criteria
- `query-log.md`: exact query families, cutoff, inclusion rules, and ranking method
- `distilled-support-response.md`: the stage 3 synthesis, written only after the raw archive is complete
- `raw/`: one captured record per source URL, each with URL, fetch date, source type, and the facts retained for this component

## Customer-facing prohibition

The raw archive must preserve upstream names and URLs for provenance. Nothing in `../../white-label-response-library/` may contain or link to those names. The runtime validator enforces that separation.
