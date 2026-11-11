# Use the frontend-design skill for UI work

Whenever the user asks to design or build a website, landing page, dashboard, or app screen, load the `frontend-design` skill before writing any UI code. The skill is Anthropic's, published in the `anthropics/skills` repository, and is installed as a personal skill at `~/.claude/skills/frontend-design/SKILL.md`. In Claude Code and Cowork invoke it as `/frontend-design`; in Cursor and Codex, read that file directly at the start of the task. The point of the rule is to stop generic, AI-looking pages.

## What the skill requires

- Ground the design in the real subject matter and audience before choosing palette, type, or layout.
- Work in two passes. First write a compact design plan: color tokens, typefaces and their roles, a layout concept, and the principles that make this page specific. Then review that plan against the brief, revise anything that reads as the default you would produce for any similar page, and only then build.
- Avoid the known tells: cream background with a terracotta accent, near-black with one acid accent, identical rounded cards with the same soft shadow, all-caps eyebrow labels above every heading, fade-and-slide-up motion on every section, arrows appended to button text.
- Spend boldness in one place and keep everything else quiet. Hit the quality floor without announcing it: responsive to mobile, visible keyboard focus, reduced motion respected, accessible contrast.

## Examples

- BAD: The user asks for a landing page and you go straight to a hero headline, three feature cards, and a gradient call to action.
- GOOD: You load `/frontend-design`, write a short design plan tied to the product and its audience, revise the parts that look templated, and then write the code.
- BAD: The user asks for a dashboard screen and you reuse the same sidebar and card grid you would produce for any admin panel.
- GOOD: You start from what the data is and who reads it, and let that drive the layout and type choices.

## Exceptions

- Small tweaks to existing UI (fix a margin, rename a label, adjust one color) do not need the skill.
- If the brief pins down a visual direction, follow it exactly, even when it matches one of the known defaults. The brief's own words win.
- If the skill is not installed, say so and install it from `anthropics/skills` before continuing, rather than designing without it.
