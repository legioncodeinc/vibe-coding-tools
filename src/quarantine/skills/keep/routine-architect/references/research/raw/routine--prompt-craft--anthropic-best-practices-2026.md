# Prompt engineering best practices for 2026

- **URL:** https://claude.com/blog/best-practices-for-prompt-engineering
- **Fetched:** 2026-08-17
- **Published:** 2025-11-10
- **Source type:** official-docs (Anthropic, first party)
- **Why archived:** Primary vendor statement of what makes a prompt work. A routine prompt
  is a prompt that runs unattended forever, so every rule here applies with the stakes
  raised: nobody is present to re-prompt when it goes wrong.

## Core techniques

**Be explicit and clear.** Quoted: "Tell the model exactly what you want to see." Use
direct action verbs (Write, Analyze, Generate, Create). Specify quality and depth
expectations rather than assuming the model infers them.

**Provide context and motivation.** Explain the reasoning behind constraints so the model
can make better decisions in cases the prompt did not anticipate. Share purpose, audience,
and the problem being solved.

**Be specific.** Include clear constraints (word count, format, timeline), relevant
context, desired output structure, and any requirements or restrictions.

**Use examples.** One-shot prompting demonstrates format more effectively than description
alone. Claude 4.x models "pay very close attention to details in examples."

**Give permission to express uncertainty.** The worked example given:

> "Analyze this financial data and identify trends. If the data is insufficient to draw
> conclusions, say so rather than speculating"

Stated effect: reduces hallucinations by allowing the model to acknowledge limitations.

## Advanced techniques

- **Prefill the response** to guide format, tone, or structure. Particularly effective for
  JSON or structured output.
- **Chain of thought**, from basic ("Think step-by-step") to guided (specific reasoning
  stages) to structured (tags separating reasoning from the final answer). Extended
  thinking is preferable where available.
- **Control output format.** Tell the model what TO do instead of what NOT to do. Match
  prompt style to desired output style. Be explicit about formatting preferences.
- **Prompt chaining.** Break complex tasks into sequential steps with separate prompts,
  trading latency for accuracy.

## Decision framework

Start by ensuring clarity, then progress based on complexity:

1. Is the request clear and explicit?
2. Is the task simple?
3. Does the task require specific formatting?
4. Is the task complex?
5. Does it need reasoning?

## Common mistakes

- Do not over-engineer. Longer prompts are not inherently better.
- Do not ignore basics. Clarity matters more than advanced techniques.
- Do not assume the model reads minds. Be specific.
- Do not use every technique simultaneously.
- Do not skip iteration and testing.
- Do not rely on outdated techniques. This post names **XML tags and heavy role-prompting**
  as outdated.

## Key principle, quoted

> "The best prompt isn't the longest or most complex. It's the one that achieves your goals
> reliably with the minimum necessary structure"

Start simple, add complexity only when needed, and test each addition to verify it improved
something.

## Note on an internal conflict

This post lists XML tags among "outdated techniques." The Claude platform documentation
(archived separately as
`routine--prompt-craft--claude-platform-docs-prompting.md`) actively recommends XML tags
for structuring complex prompts and gives worked examples. Both are first-party Anthropic
sources published under different surfaces. The conflict is recorded rather than resolved
here; see the distillation.
