# Prompting best practices (Claude Platform Docs)

- **URL:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- **Fetched:** 2026-08-17
- **Source type:** official-docs (Anthropic platform documentation)
- **Why archived:** The deepest first-party rule set. Supplies the golden rule of prompt
  clarity, the output-format rules, the long-horizon and state-tracking guidance, and the
  autonomy and safety guidance that a recurring unattended agent depends on.

## Be clear and direct

**Golden rule, quoted:**

> "Show your prompt to a colleague with minimal context on the task and ask them to follow
> it. If they'd be confused, Claude will be too."

Supporting guidance:

- Be specific about the desired output format and constraints.
- Provide instructions as sequential steps, using numbered lists or bullets when order or
  completeness matters.
- Think of the model as "a brilliant but new employee who lacks context on your norms and
  workflows."

## Add context to improve performance

Quoted: "Providing context or motivation behind your instructions, such as explaining to
Claude why such behavior is important, can help Claude better understand your goals and
deliver more targeted responses."

## Use examples effectively

- **Relevant:** mirror the actual use case closely.
- **Diverse:** cover edge cases and vary enough that the model does not pick up unintended
  patterns.
- **Structured:** wrap examples in example tags.
- **Quantity:** 3 to 5 examples for best results.

## Structure prompts with XML tags

Use consistent, descriptive tag names. Nest tags where content has natural hierarchy. XML
tags help the model parse complex prompts unambiguously, especially when mixing
instructions, context, examples, and variable inputs.

## Give the model a role

"Setting a role in the system prompt focuses Claude's behavior and tone for your use case.
Even a single sentence makes a difference."

## Long context prompting

- **Put longform data at the top.** "Place your long documents and inputs near the top of
  your prompt, above your query, instructions, and examples. This improves performance
  across all models."
- Stated impact: "Queries at the end can improve response quality by up to 30 percent in
  tests, especially with complex, multidocument inputs."
- **Ground responses in quotes.** "For long document tasks, ask Claude to quote relevant
  parts of the documents first before carrying out its task. This helps Claude focus on the
  relevant content and ignore the rest of the document."

## Control the format of responses

Four rules:

1. **Tell the model what to do instead of what not to do.** Instead of "Do not use markdown
   in your response", try "Your response should be composed of smoothly flowing prose
   paragraphs."
2. Use format indicators (tags naming the desired shape).
3. **Match prompt style to desired output.** "The formatting style used in your prompt may
   influence Claude's response style."
4. Use detailed prompts where formatting preferences are specific.

## Verbosity

Latest models are described as more direct, more conversational, and less verbose, and may
skip detailed summaries unless prompted otherwise. Noted exception: "Opus 5 is an exception
on verbosity: its default user-facing responses run longer than prior models', and raising
or lowering effort does not reliably change visible response length. Prompt explicitly for
conciseness instead."

## Tool use

Quoted: "Claude's latest models are trained for precise instruction following and benefit
from explicit direction to use specific tools. If you say 'can you suggest some changes,'
Claude will sometimes provide suggestions rather than implementing them."

Instead of "Can you suggest some changes?", use "Implement changes to X by doing Y. Use
[tool] to make these modifications."

Note on aggressive phrasing: "Claude Opus 4.5 and Claude Opus 4.6 are also more responsive
to the system prompt than previous models. If your prompts were designed to reduce
undertriggering on tools or skills, these models may now overtrigger. The fix is to dial
back any aggressive language. Where you might have said 'CRITICAL: You MUST use this tool
when...', you can use more normal prompting like 'Use this tool when...'."

Parallel tool calling: independent tool calls should be issued in parallel; dependent ones
sequentially, and the model should never guess missing parameters.

## Long-horizon reasoning and state tracking

"Claude's latest models handle long-horizon reasoning tasks with strong state tracking.
Claude maintains orientation across extended sessions by focusing on incremental progress,
making steady advances on a few things at a time rather than attempting everything at
once."

**Workflows across multiple context windows.** Relevant guidance, condensed:

- Use a different prompt for the first window than for later windows.
- Track structured state in a structured file, unstructured progress in freeform notes.
- When a window is cleared, consider starting fresh rather than compacting, and be
  prescriptive about how the new session starts. Worked examples given include "Review
  progress.txt, tests.json, and the git logs."
- Provide verification tools so the agent can check correctness without continuous human
  feedback.

## Balancing autonomy and safety

Sample prompt quoted in the docs:

> "Consider the reversibility and potential impact of your actions. You are encouraged to
> take local, reversible actions like editing files or running tests, but for actions that
> are hard to reverse, affect shared systems, or could be destructive, ask the user before
> proceeding."

Actions listed as warranting confirmation include destructive operations, hard-to-reverse
operations, and "Operations visible to others: pushing code, commenting on PRs/issues,
sending messages, modifying shared infrastructure."

## Research and information gathering

Optimal practice listed: provide clear success criteria defining what a successful answer
looks like; encourage source verification across multiple sources; for complex research,
track confidence levels in progress notes to improve calibration and self-critique the
approach regularly.

## Investigate before answering

Sample prompt quoted: "Never speculate about code you have not opened... Never make any
claims about code before investigating unless you are certain of the correct answer."

## Summary of critical rules as the doc states them

Golden rule of clarity; say what to do not what not to do; 3 to 5 examples; XML tags for
structure; long documents at the top; quotes first for long documents; match prompt
formatting to desired output; be specific about output format rather than using negations;
set a role; provide context and motivation; steer tool use explicitly; track state in
structured formats; investigate before answering; avoid over-engineering.
