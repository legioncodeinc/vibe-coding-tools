# Effective context engineering for AI agents

- **URL:** https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Fetched:** 2026-08-17
- **Published:** 2025-09-29
- **Source type:** official-docs (Anthropic engineering)
- **Why archived:** The first-party statement on how an agent keeps working coherently
  across sessions that do not share a context window. A recurring routine is exactly that
  case: every run starts cold, and the only bridge between runs is what the previous run
  wrote down.

## Definition

Context engineering is "the set of strategies for curating and maintaining the optimal set
of tokens (information) during LLM inference." It is framed as an evolution beyond prompt
engineering, covering everything that enters the context window: system instructions,
tools, external data, and message history.

## The right altitude for system prompts

Two failure poles are named:

- Overly rigid prompts with hardcoded logic, which are fragile.
- Vague guidance, which fails to give concrete direction.

The "right altitude" is specific enough to guide behavior while flexible enough to let the
model apply strong heuristics. Prompts should be organized into distinct sections using XML
tags or Markdown headers, starting minimal and adding clarity in response to observed
failure modes.

## Minimal high-signal tokens

The guiding principle is finding "the smallest possible set of high-signal tokens that
maximize the likelihood of some desired outcome." This reflects a finite "attention
budget": context is a precious resource and every token spends some of it.

## Long-horizon task techniques

**Compaction.** Summarize a conversation approaching the context limit, then reinitialize
with the compressed summary, preserving critical decisions and unresolved issues.

**Structured note-taking.** Agents write notes to external memory and retrieve them later,
enabling persistent tracking across extended tasks without consuming the context window.

**Sub-agent architectures.** Specialized agents handle focused tasks with clean context
windows and return distilled summaries to a coordinating agent.

## Persistence across sessions

The article describes agents maintaining "precise tallies across thousands of game steps"
and continuing "multi-hour training sequences" after context resets by consulting their own
notes. The mechanism named is the agent reading back its own written record, not the model
remembering.
