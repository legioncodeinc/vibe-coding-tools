# Effective context engineering for AI agents

- **Title:** Effective context engineering for AI agents
- **URL:** https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Fetched:** 2026-08-17
- **Source type:** official-docs (model vendor engineering guidance; the vendor has a
  commercial interest but also direct measurement access)

## Context rot and the attention budget

The central claim: as the number of tokens in the context window grows, the model's ability
to accurately recall information from that context decreases. The article names this context
rot and gives an architectural reason: transformer attention forms n squared pairwise
relationships for n tokens, so attention is spread thinner as context grows.

Consequence for a knowledge pack: more documentation is not monotonically better. A pack
that is exhaustive can perform worse than a pack that is tight.

## The smallest high-signal set

Quoted principle: pursue "the smallest possible set of high-signal tokens that maximize the
likelihood of some desired outcome."

Immediately qualified, also quoted: "minimal does not necessarily mean short; you still need
to give the agent sufficient information."

## Structure

The guidance recommends organizing content into distinct sections delimited by either XML
tagging or Markdown headers. Named examples of section markers include background
information, instructions, and tool guidance.

Note the format is presented as either-or. The source does not claim markdown headings
outperform XML tags or the reverse.

## The right altitude

Instructions have two failure modes: hardcoded, overly complex logic that is brittle, and
vague guidance that assumes a shared understanding that does not exist. The target zone,
quoted: "specific enough to guide behavior effectively, yet flexible enough to provide the
model with strong heuristics."

## Ambiguity

Quoted: "If a human engineer can't definitively say which tool should be used in a given
situation, an AI agent can't be expected to do better."

Generalized to documentation: an ambiguity a human reader has to resolve by asking someone
is an ambiguity a model resolves by guessing.

## Just in time retrieval

Rather than preloading everything, agents are advised to hold lightweight identifiers and
load data at runtime through tools, the way a person uses a filing system rather than
memorizing the corpus.

Consequence for a knowledge pack: a stable, predictable file naming scheme with a short
index is doing real work. It is what makes selective loading possible.

## Evidence quality

The context rot claim is presented as a research finding without an inline citation in the
fetched text. The structural recommendations are presented as practice. Treat the attention
budget argument as well-motivated by the stated architecture and the specific formatting
recommendations as unmeasured.
