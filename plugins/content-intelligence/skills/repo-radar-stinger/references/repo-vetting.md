# Repo vetting: what earns a post and what proves the trend

## What counts as trending TODAY (the 24-hour gate)

The freshness rule binds the SPIKE, not the repo's age. Acceptable evidence, any one of:

- The repo appears on today's https://github.com/trending daily board (capture its "stars today" figure).
- An hourly star-momentum tracker (trendshift.io, OSS Insight `period=past_24_hours`) ranks it today.
- A release, disclosure, or launch tied to the repo happened inside the last 24 hours (release page timestamp, advisory publish time).

A repo that trended last week, or that is merely popular in general, fails the gate. No evidence of a current spike, no post.

## Beats this skill hunts, in priority order

1. Vibe coding and AI-assisted development tools (agents, IDE tooling, Claude/Copilot/Cursor ecosystems, agent skills)
2. AI coding models, frameworks, and benchmarks
3. AI memory systems (agent memory, RAG infrastructure, vector stores, context tooling)
4. Security: newly disclosed vulnerabilities, CVE proof-of-concepts, supply-chain attack write-ups, security tooling
5. Anything else genuinely remarkable on the board that a builder audience would care about

Skip: crypto pump repos, star-farmed template collections, awesome-lists with no news attached, and anything whose README is the only evidence it does what it claims (see vetting below).

## Vetting the ONE chosen repo (before writing a word)

1. Fetch the repo page itself. Capture: exact star count, stars today if shown, language, license, last-commit recency, org or author.
2. Read the README far enough to state in one sentence what the project actually does. If that sentence cannot be written honestly, drop it.
3. Sanity-check the claim: does the repo have real code and commits, or just a README and a diagram? Vaporware with 3,000 stars is a story about star-farming, or it is nothing.
4. For vulnerability or exploit repos: post about the DISCLOSURE as news (what is affected, severity, patch status, who published it). Link the advisory or the researcher's write-up alongside the repo. Never write usage instructions for the exploit, and never frame the post as a how-to. The story is that it happened, not how to do it.
5. Cross-check with one search for independent coverage or the maintainer's own announcement. A second receipt makes the post stronger; for security topics it is mandatory.
6. Numbers in the post (stars, stars-today, affected versions) must match what was captured, exactly.

## Editorial boundaries

- No celebrity gossip crossovers, no Democrat-promoting briefs; same boundaries as the news skill's references/source-tiers.md editorial section, applied on the rare occasion a repo story is political.
- Sharp and provocative, never fabricated. The post must survive its own receipts being opened.
