# AGENTS.md - the shared rules baseline
- URL: https://agents.md/
- Fetched: 2026-08-14
- Source type: official docs (AGENTS.md open standard, stewarded by the Agentic AI Foundation / Linux Foundation)
- Component: Rules, all four harnesses (Claude Code reads via import/symlink, Cursor and Codex read natively)

## What it is and isn't

"README.md files are for humans: quick starts, project descriptions, and contribution guidelines. AGENTS.md complements this by containing the extra, sometimes detailed context coding agents need: build steps, tests, and conventions that might clutter a README or aren't relevant to human contributors." It is plain Markdown - "No. AGENTS.md is just standard Markdown. Use any headings you like; the agent simply parses the text you provide." No required frontmatter, no required sections.

"Rather than introducing another proprietary file, we chose a name and format that could work for anyone." AGENTS.md "emerged from collaborative efforts across the AI software development ecosystem, including OpenAI Codex, Amp, Jules from Google, Cursor, and Factory," and is now stewarded by the Agentic AI Foundation under the Linux Foundation as a vendor-neutral standard - not an OpenAI/Codex-only artifact.

## How to use it (official four-step guidance)

1. Add an `AGENTS.md` at the repository root. "Most coding agents can even scaffold one for you if you ask nicely."
2. Cover what matters: popular sections (none required) are Project overview, Build and test commands, Code style guidelines, Testing instructions, Security considerations.
3. Add extra instructions: commit-message/PR conventions, security gotchas, large-dataset notes, deployment steps - "anything you'd tell a new teammate belongs here too."
4. For a large monorepo, use **nested AGENTS.md files per subproject**. "Agents automatically read the nearest file in the directory tree, so the closest one takes precedence and every subproject can ship tailored instructions." The official example: "the main OpenAI repo has 88 AGENTS.md files."

## Precedence - the official FAQ answer

"The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything." This is the base-spec position. As already flagged in the queen-bee-stinger distilled research (Codex section), Codex CLI's own documented behavior is reported elsewhere as **concatenation** of every AGENTS.md from git root down to cwd rather than single-file selection - an open, unresolved discrepancy (GitHub issue agentsmd/agents.md#53) between this base-spec FAQ answer and OpenAI's own product behavior. Treat "closest wins" as the spec's stated intent and Codex's concatenation-with-recency-precedence as a documented implementation variance, not a contradiction to paper over.

## Migration guidance (directly reusable for Hive rule authoring)

"Rename existing files to AGENTS.md and create symbolic links for backward compatibility" - the official migration shim is exactly the `mv AGENT.md AGENTS.md && ln -s AGENTS.md AGENT.md` pattern already captured from Codex-specific research, confirming it is the spec's own recommended approach, not a Codex-only workaround.

## Why this is the shared rules baseline across three of the four harnesses

Per the queen-bee-stinger distilled research: Codex reads `AGENTS.md` natively as its primary rules mechanism; Cursor treats `AGENTS.md` as a first-class, frontmatter-free alternative to `.cursor/rules/*.mdc` with documented nested-directory merge behavior; Claude Code does not read `AGENTS.md` directly but can import it into `CLAUDE.md` with `@AGENTS.md` (or symlink it, admin/dev-mode permitting on Windows) and layer Claude-specific instructions below it. Cowork has no direct AGENTS.md story in the research (its rules mechanism is Global/Folder instructions set through the app UI), but a repo-committed AGENTS.md still ships to a Cowork cloud session as an ordinary file Claude can read and follow if a skill or plugin instructs it to. For a capability meant to carry consistent baseline instructions across Claude Code, Cursor, and Codex with the least duplication, author the shared rule content once in a root `AGENTS.md` and layer any harness-specific addendum on top per that harness's own mechanism, rather than maintaining three independent rule files that drift.
