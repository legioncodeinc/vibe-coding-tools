# The llms.txt proposal

- **Title:** The /llms.txt file
- **URL:** https://llmstxt.org/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (the specification's own site, proposal by Jeremy Howard)

## Problem stated

1. Context window limits. Quoted: "Context windows, while larger than they were, are still
   too small for most websites in their entirety, and every wasted token costs time and
   money."
2. Extraction noise. Pages are built for people, carrying navigation, ads, and JavaScript,
   which makes clean extraction "difficult and imprecise."

## The format

Markdown, with a fixed hierarchy:

- One H1 with the project or site name. Required.
- A blockquote with a short summary.
- Optional detail paragraphs, with no headings.
- H2 delimited sections, each containing a curated list of files.
- List items in the form `[name](url): optional notes`.

Also recommends publishing `.md` versions of pages alongside the HTML, linked with
`rel="alternate" type="text/markdown"`.

## Why markdown

Quoted: "At the moment the most widely and easily understood format for language models is
Markdown." The stated balance is human readability plus machine parseability, precise enough
for fixed processing while still interpretable by a model.

## Adoption

Stated on the site: thousands of sites publish one; OpenAI, Anthropic, and Google Gemini
publish theirs; Chrome's Lighthouse audits for it; Mintlify, GitBook, and Wix generate it
automatically.

## Evidence quality, stated plainly

Adoption is evidence of adoption, not of effectiveness. The site presents no measurement
showing a model answers better when given llms.txt than when given the same content in
another arrangement. The transferable ideas are the ones with an independent mechanism
behind them: a short curated index of files with one-line descriptions, and a predictable
markdown shape.
