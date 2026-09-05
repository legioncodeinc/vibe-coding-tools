# Markdown for agents (Cloudflare)

- **Title:** Markdown for Agents
- **URL:** https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (infrastructure vendor product documentation)

## What it is

Cloudflare converts HTML to markdown at the edge for AI clients, served through content
negotiation on the `Accept: text/markdown` header for enabled zones.

## Stated rationale

Quoted: "Markdown has quickly become the lingua franca for agents and AI systems as a whole.
The format's explicit structure makes it ideal for AI processing, ultimately resulting in
better results while minimizing token waste."

The "better results" half of that sentence is an assertion. The "token waste" half is
measured, see below.

## The measured part

Two response headers carry token counts:

- `x-markdown-tokens`: tokens in the converted markdown.
- `x-original-tokens`: tokens in the original HTML.

The documentation says these let a client calculate context window size, estimate the token
saving from conversion, and decide a chunking strategy. This is a real measurement surface
for the token-reduction claim, and it is per-page rather than a blanket ratio.

## Output structure

A consistent, predictable layout in three parts:

1. YAML frontmatter carrying metadata from the page's meta tags.
2. Body markdown, with navigation, headers, and scripts stripped.
3. JSON-LD structured data in a fenced code block.

Availability: Pro, Business, and Enterprise plans at no cost. Two megabyte response cap.

## What transfers to a knowledge pack

The three-part shape: machine-readable metadata block first, prose body second, structured
data last, in a fixed order so a consumer can rely on position. The specific value here is
predictability, not markdown as such.
