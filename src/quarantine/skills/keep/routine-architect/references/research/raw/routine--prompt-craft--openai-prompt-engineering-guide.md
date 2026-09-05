# Prompt engineering (OpenAI API docs)

- **URL:** https://developers.openai.com/api/docs/guides/prompt-engineering
- **Fetched:** 2026-08-17
- **Source type:** official-docs (OpenAI platform documentation)
- **Why archived:** Second independent vendor. Where OpenAI and Anthropic agree, the
  guidance is likely to be about how language models work rather than about one model
  family, which makes it safe to build a rubric on.

## Message roles and authority

- `developer` messages take priority over `user` messages.
- The `instructions` parameter takes precedence over prompt content.
- Framing given: treat `developer` messages as function definitions and `user` messages as
  arguments.

## Output format specification

- Specify the output exactly. Worked example: "Only output a single word in your response
  with no additional formatting or commentary."
- Avoid Markdown unless explicitly requested.
- Use structured output formats (JSON schemas) when deterministic data is needed.

## Recommended prompt structure, in order

1. Identity, purpose, and communication style
2. Instructions and rules, both what to do and what not to do
3. Examples with diverse input and output pairs
4. Context information, such as proprietary data and reference material

## Formatting and clarity

- Use Markdown headers and lists to mark distinct sections.
- Use XML tags to delineate content boundaries; XML attributes can carry metadata about
  the content.

## Few-shot examples

Provide "a handful of input/output examples" covering diverse scenarios, including both
positive and negative cases.

## Agentic and repeated tasks

- **Planning and persistence:** "Resolve the full query before yielding control." Decompose
  into sub-tasks, reflect after each step, and "confirm that each is completed" before
  stopping. Use TODO lists to track progress.
- **Transparency at key steps:** require the model to explain tool usage at notable
  decision points.

## Model-specific guidance

- GPT models benefit from "precise instructions that explicitly provide the logic and
  data", concrete tool-use examples, and explicit testing and validation requirements.
- Reasoning models respond better to "high-level guidance" than to step-by-step
  instructions, and need less explicit direction.

## Production practice

- Pin applications to specific model snapshots for consistency.
- Store prompts in application code rather than in reusable objects.
- Build test and evaluation suites to monitor performance over time.
- Use feature flags for staged rollouts of prompt changes.
